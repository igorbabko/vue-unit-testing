import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseSelect from '../../src/components/BaseSelect.vue'
import TimelineHour from '../../src/components/TimelineHour.vue'
import TimelineItem from '../../src/components/TimelineItem.vue'
import TimelineStopwatch from '../../src/components/TimelineStopwatch.vue'
import * as timelineItems from '../../src/timeline-items'
import { SelectOption, TimelineItem as TimelineItemType } from '../../src/types'
import { assertSpy } from '../utils'

function shallowMountTimelineItem(overrides: Partial<TimelineItemType> = {}) {
  return shallowMount(TimelineItem, {
    props: { timelineItem: createTimelineItem(overrides) }
  })
}

function createTimelineItem(overrides: Partial<TimelineItemType> = {}): TimelineItemType {
  return {
    hour: 0,
    activityId: null,
    activitySeconds: 0,
    isActive: false,
    ...overrides
  }
}

function getActivitySelectOptions(): SelectOption[] {
  return [
    { value: '1', label: 'Training' },
    { value: '2', label: 'Reading' },
    { value: '3', label: 'Coding' }
  ]
}

it('renders timeline item', () => {
  vi.mock('../../src/activities', () => ({ activitySelectOptions: getActivitySelectOptions() }))
  const hour = 8
  const activityId = '1'
  const timelineItem = createTimelineItem({ hour, activityId })

  const wrapper = shallowMountTimelineItem(timelineItem)

  expect(wrapper.findComponent(TimelineHour).props('hour')).toBe(hour)
  expect(wrapper.findComponent(TimelineStopwatch).props('timelineItem')).toEqual(timelineItem)
  expect(wrapper.findComponent(BaseSelect as any).props()).toEqual({
    placeholder: 'Rest',
    selected: activityId,
    options: getActivitySelectOptions()
  })
})

it('updates timeline item when selecting activity', () => {
  const updateTimelineItemSpy = vi.spyOn(timelineItems, 'updateTimelineItem')
  const activityId = '1'
  const timelineItem = createTimelineItem({ activityId: null })

  shallowMountTimelineItem(timelineItem)
    .findComponent(BaseSelect as any)
    .vm.$emit('select', activityId)

  assertSpy(updateTimelineItemSpy, [{ ...timelineItem, activityId }, { activityId }])
  vi.restoreAllMocks()
})
