import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import * as activities from '../../src/activities'
import ActivityItem from '../../src/components/ActivityItem.vue'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import * as timelineItems from '../../src/timeline-items'
import { ButtonType, IconName } from '../../src/types'

it('has delete button', () => {
  const wrapper = mount(ActivityItem, {
    props: {
      activity: {
        id: '',
        name: '',
        secondsToComplete: 0
      }
    }
  })

  expect(wrapper.findComponent(BaseButton).props('type')).toBe(ButtonType.DANGER)
  expect(wrapper.findComponent(BaseIcon).props('name')).toBe(IconName.TRASH)
})

it('deletes activity', () => {
  const resetTimelineItemActivitiesSpy = vi.spyOn(timelineItems, 'resetTimelineItemActivities')
  const deleteActivitySpy = vi.spyOn(activities, 'deleteActivity')
  const activity = {
    id: '',
    name: '',
    secondsToComplete: 0
  }
  const wrapper = mount(ActivityItem, {
    props: { activity }
  })

  wrapper.find('button').trigger('click')

  expect(resetTimelineItemActivitiesSpy).toBeCalledTimes(1)
  expect(resetTimelineItemActivitiesSpy).toBeCalledWith(timelineItems.timelineItems.value, activity)
  expect(deleteActivitySpy).toBeCalledTimes(1)
  expect(deleteActivitySpy).toBeCalledWith(activity)
  vi.restoreAllMocks()
})
