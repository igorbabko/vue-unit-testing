import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TheTimelineIndicator from '../../src/components/TheTimelineIndicator.vue'
import { HUNDRED_PERCENT } from '../../src/constants'
import { secondsSinceMidnightInPercentage } from '../../src/time'

it('has top offset that reflects current time of the day', async () => {
  vi.hoisted(() => vi.setSystemTime(new Date('2024-04-10 08:00:00')))

  const windowHeight = 2700
  const offset = (secondsSinceMidnightInPercentage.value * windowHeight) / HUNDRED_PERCENT

  window.HTMLDivElement.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: 0,
    width: 0,
    height: windowHeight,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON: vi.fn()
  }))

  const wrapper = shallowMount(TheTimelineIndicator)

  await flushPromises()
  // await nextTick()

  expect(wrapper.element.style.top).toBe(`${offset}px`)

  vi.useRealTimers().restoreAllMocks()
})
