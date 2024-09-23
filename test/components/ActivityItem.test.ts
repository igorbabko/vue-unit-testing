import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import * as activities from '../../src/activities'
import ActivityItem from '../../src/components/ActivityItem.vue'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import * as timelineItems from '../../src/timeline-items'
import { Activity, ButtonType, IconName } from '../../src/types'

function mountActivityItem(activityOverrides: Partial<Activity> = {}) {
  return mount(ActivityItem, {
    props: {
      activity: createActivity(activityOverrides)
    }
  })
}

function createActivity(overrides: Partial<Activity> = {}) {
  return {
    id: '',
    name: '',
    secondsToComplete: 0,
    ...overrides
  }
}

it('has delete button', () => {
  const wrapper = mountActivityItem()

  expect(wrapper.findComponent(BaseButton).props('type')).toBe(ButtonType.DANGER)
  expect(wrapper.findComponent(BaseIcon).props('name')).toBe(IconName.TRASH)
})

it('deletes activity', () => {
  const resetTimelineItemActivitiesSpy = vi.spyOn(timelineItems, 'resetTimelineItemActivities')
  const deleteActivitySpy = vi.spyOn(activities, 'deleteActivity')
  const activity = createActivity()
  const wrapper = mountActivityItem(activity)

  wrapper.find('button').trigger('click')

  expect(resetTimelineItemActivitiesSpy).toBeCalledTimes(1)
  expect(resetTimelineItemActivitiesSpy).toBeCalledWith(timelineItems.timelineItems.value, activity)
  expect(deleteActivitySpy).toBeCalledTimes(1)
  expect(deleteActivitySpy).toBeCalledWith(activity)
  vi.restoreAllMocks()
})

it('shows activity name', () => {
  const name = 'Reading'

  expect(mountActivityItem({ name }).text()).toContain(name)
})
