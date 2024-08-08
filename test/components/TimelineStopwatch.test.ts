import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import TimelineStopwatch from '../../src/components/TimelineStopwatch.vue'
import { formatSeconds } from '../../src/functions'
import { ButtonType, type TimelineItem } from '../../src/types'

vi.mock('../../src/timeline-item-timer', () => ({
  startTimelineItemTimer: vi.fn(),
  stopTimelineItemTimer: vi.fn(),
  resetTimelineItemTimer: vi.fn()
}))

vi.mock('../../src/timeline-items', () => ({
  updateTimelineItem: vi.fn(),
  activeTimelineItem: getTimelineItem()
}))

const timelineItem: TimelineItem = {
  hour: 8,
  activityId: '2',
  activitySeconds: 0,
  isActive: false
}

function getTimelineItem() {
  return timelineItem
}

it('shows time', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  console.log(wrapper.text())

  expect(wrapper.text()).toContain(formatSeconds(timelineItem.activitySeconds))
})

it('has reset button', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[0].vm.type).toBe(ButtonType.DANGER)
})

it('has play button if stopwatch is active', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)
})

it('has pause button if stopwatch is active', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
})
