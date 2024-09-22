import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import * as activities from '../../src/activities'
import ActivityItem from '../../src/components/ActivityItem.vue'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import BaseSelect from '../../src/components/BaseSelect.vue'
import RemainingActivitySeconds from '../../src/components/RemainingActivitySeconds.vue'
import { PERIOD_SELECT_OPTIONS, SECONDS_IN_HOUR, SECONDS_IN_MINUTE } from '../../src/constants'
import { formatSecondsWithSign } from '../../src/functions'
import * as timelineItems from '../../src/timeline-items'
import { Activity, ButtonType, IconName } from '../../src/types'

function mountActivityItem(activityOverrides: Partial<Activity> = {}) {
  return mount(ActivityItem, {
    props: { activity: createActivity(activityOverrides) }
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

  mountActivityItem(activity).find('button').trigger('click')

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

it('has period select', () => {
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const wrapper = mountActivityItem({ secondsToComplete })

  expect(wrapper.findComponent(BaseSelect as any).props()).toEqual({
    placeholder: 'hh:mm',
    options: PERIOD_SELECT_OPTIONS,
    selected: secondsToComplete
  })
})

it('updates seconds to complete field of activity', async () => {
  const updateActivity = vi.spyOn(activities, 'updateActivity')
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const updatedSecondsToComplete = SECONDS_IN_MINUTE * 30
  const activity = createActivity({ secondsToComplete })
  const wrapper = mountActivityItem(activity)

  expect(wrapper.text()).toContain(formatSecondsWithSign(-secondsToComplete))

  // await wrapper.find('select').setValue(`${updatedSecondsToComplete}`)
  await wrapper.findComponent(BaseSelect as any).vm.$emit('select', updatedSecondsToComplete)

  expect(wrapper.text()).toContain(formatSecondsWithSign(-updatedSecondsToComplete))
  expect(updateActivity).toBeCalledTimes(1)
  expect(updateActivity).toBeCalledWith(
    { ...activity, secondsToComplete: updatedSecondsToComplete },
    { secondsToComplete: updatedSecondsToComplete }
  )

  vi.restoreAllMocks()
})

it('updates seconds to complete field of activity to 0 if no period is selected', () => {
  const updateActivity = vi.spyOn(activities, 'updateActivity')
  const secondsToComplete = 0
  const activity = createActivity()
  const wrapper = mountActivityItem(activity)

  wrapper.findComponent(BaseSelect as any).vm.$emit('select', null)

  expect(updateActivity).toBeCalledTimes(1)
  expect(updateActivity).toBeCalledWith({ ...activity, secondsToComplete }, { secondsToComplete })

  vi.restoreAllMocks()
})

it('has remaining activity seconds', () => {
  const activity = createActivity({ secondsToComplete: SECONDS_IN_HOUR * 1 })
  const wrapper = mountActivityItem(activity)

  expect(wrapper.findComponent(RemainingActivitySeconds).props('activity')).toEqual(activity)
})

it('does not have remaining activity seconds if seconds to complete field of activity = 0', () => {
  const wrapper = mountActivityItem({ secondsToComplete: 0 })

  expect(wrapper.findComponent(RemainingActivitySeconds).exists()).toBe(false)
})
