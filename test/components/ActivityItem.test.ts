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
import { ButtonType, IconName } from '../../src/types'

const activity = {
  id: '1',
  name: 'Reading',
  secondsToComplete: SECONDS_IN_HOUR * 1
}

function mountActivityItem(secondsToComplete = 0) {
  return mount(ActivityItem, {
    props: {
      activity: { ...activity, secondsToComplete }
    }
  })
}

it('has delete button', () => {
  const wrapper = mountActivityItem()

  expect(wrapper.findComponent(BaseButton).vm.type).toBe(ButtonType.DANGER)
  expect(wrapper.findComponent(BaseIcon).vm.name).toBe(IconName.TRASH)
})

it('deletes activity', () => {
  const resetTimelineItemActivities = vi.spyOn(timelineItems, 'resetTimelineItemActivities')
  const deleteActivity = vi.spyOn(activities, 'deleteActivity')

  mountActivityItem(SECONDS_IN_HOUR * 1)
    .find('button')
    .trigger('click')

  expect(resetTimelineItemActivities).toBeCalledTimes(1)
  expect(resetTimelineItemActivities).toBeCalledWith(timelineItems.timelineItems.value, activity)
  expect(deleteActivity).toBeCalledTimes(1)
  expect(deleteActivity).toBeCalledWith(activity)

  vi.restoreAllMocks()
})

it('shows activity name', () => {
  expect(mountActivityItem().text()).toContain('Reading')
})

it('has seconds to complete select', () => {
  const baseSelectWrapper = mountActivityItem(SECONDS_IN_HOUR * 1).findComponent(BaseSelect as any)

  expect(baseSelectWrapper.vm.options).toBe(PERIOD_SELECT_OPTIONS)
  expect(baseSelectWrapper.vm.selected).toBe(SECONDS_IN_HOUR * 1)
})

it('updates seconds to complete', async () => {
  const updateActivity = vi.spyOn(activities, 'updateActivity')
  const secondsToComplete = SECONDS_IN_MINUTE * 30
  const wrapper = mountActivityItem(SECONDS_IN_HOUR * 1)

  expect(wrapper.text()).toContain(formatSecondsWithSign(-SECONDS_IN_HOUR * 1))

  // await wrapper.find('select').setValue(`${secondsToComplete}`)
  await wrapper.findComponent(BaseSelect as any).vm.$emit('select', secondsToComplete)

  expect(wrapper.text()).toContain(formatSecondsWithSign(-SECONDS_IN_MINUTE * 30))
  expect(updateActivity).toBeCalledTimes(1)
  expect(updateActivity).toBeCalledWith({ ...activity, secondsToComplete }, { secondsToComplete })

  vi.restoreAllMocks()
})

it('updates seconds to complete to zero if none is selected', () => {
  const updateActivity = vi.spyOn(activities, 'updateActivity')
  const wrapper = mountActivityItem(SECONDS_IN_HOUR * 1)
  const secondsToComplete = 0

  wrapper.findComponent(BaseSelect as any).vm.$emit('select')

  expect(updateActivity).toBeCalledTimes(1)
  expect(updateActivity).toBeCalledWith({ ...activity, secondsToComplete }, { secondsToComplete })

  vi.restoreAllMocks()
})

it('has remaining activity seconds', () => {
  expect(
    mountActivityItem(SECONDS_IN_HOUR * 1).findComponent(RemainingActivitySeconds).vm.activity
  ).toEqual(activity)
})

it('does not have remaining activity seconds if seconds to complete is 0', () => {
  expect(mountActivityItem(0).findComponent(RemainingActivitySeconds).exists()).toBe(false)
})
