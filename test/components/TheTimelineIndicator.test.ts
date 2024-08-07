import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TheTimelineIndicator from '../../src/components/TheTimelineIndicator.vue'

it('has top offset that reflects current time of the day', async () => {
  window.HTMLDivElement.prototype.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: -1206,
    width: 383,
    height: 4824,
    top: -1206,
    right: 383,
    bottom: 3618,
    left: 0,
    toJSON: vi.fn()
  }))

  vi.hoisted(() => vi.setSystemTime(new Date('2024-04-10 08:00:00')))

  const wrapper = shallowMount(TheTimelineIndicator)

  await flushPromises()

  expect(wrapper.element.style.top).toBe('1608px')

  vi.useRealTimers().restoreAllMocks()
})
