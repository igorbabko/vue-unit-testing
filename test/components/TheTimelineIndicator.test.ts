import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TheTimelineIndicator from '../../src/components/TheTimelineIndicator.vue'
import { HUNDRED_PERCENT } from '../../src/constants'
import { secondsSinceMidnightInPercentage } from '../../src/time'

it('has top offset that reflects current time of the day', async () => {
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

  expect(wrapper.element.style.top).toBe(`${offset}px`)
  vi.restoreAllMocks()
})
