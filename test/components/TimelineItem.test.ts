import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseSelect from '../../src/components/BaseSelect.vue'
import TimelineHour from '../../src/components/TimelineHour.vue'
import TimelineItem from '../../src/components/TimelineItem.vue'
import TimelineStopwatch from '../../src/components/TimelineStopwatch.vue'
import { SECONDS_IN_HOUR } from '../../src/constants'
import * as timelineItems from '../../src/timeline-items'
import { TimelineItem as TimelineItemType } from '../../src/types'

vi.mock('../../src/activities', () => ({ activitySelectOptions: getActivitySelectOptions() }))

const timelineItem: TimelineItemType = {
  hour: 8,
  activityId: '2',
  activitySeconds: SECONDS_IN_HOUR * 1,
  isActive: false
}

function shallowMountTimelineItem() {
  return shallowMount(TimelineItem, {
    props: { timelineItem }
  })
}

function getActivitySelectOptions() {
  return [
    { value: '1', label: 'Training' },
    { value: '2', label: 'Reading' },
    { value: '3', label: 'Coding' }
  ]
}

it('renders timeline item', () => {
  const wrapper = shallowMountTimelineItem()

  expect(wrapper.findComponent(TimelineHour).props('hour')).toBe(timelineItem.hour)
  expect(wrapper.findComponent(BaseSelect as any).props('selected')).toBe(timelineItem.activityId)
  expect(wrapper.findComponent(BaseSelect as any).props('options')).toEqual(
    getActivitySelectOptions()
  )
  expect(wrapper.findComponent(TimelineStopwatch).props('timelineItem')).toEqual(timelineItem)
})

it('updates timeline item when selecting activity', () => {
  const updateTimelineItemSpy = vi.spyOn(timelineItems, 'updateTimelineItem')
  const activityId = 1

  shallowMountTimelineItem()
    .findComponent(BaseSelect as any)
    .vm.$emit('select', activityId)

  expect(updateTimelineItemSpy).toBeCalledTimes(1)
  expect(updateTimelineItemSpy).toBeCalledWith(timelineItem, { activityId })

  vi.restoreAllMocks()
})
