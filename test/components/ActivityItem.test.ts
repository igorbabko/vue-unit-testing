import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import * as activities from '../../src/activities'
import ActivityItem from '../../src/components/ActivityItem.vue'
import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE } from '../../src/constants'
import * as timelineItems from '../../src/timeline-items'

const activity = {
  id: '1',
  name: 'Reading',
  secondsToComplete: SECONDS_IN_HOUR * 1
}

function mountActivityItem(secondsToComplete) {
  return mount(ActivityItem, {
    props: {
      activity: { ...activity, secondsToComplete }
    }
  })
}

it('shows activity info', () => {
  expect(mountActivityItem(SECONDS_IN_HOUR * 1).html())
    .toContain('Reading')
    .toContain('-01:00:00')
    .toContain('01:00')
})

it('does not show seconds to complete if it is 0', () => {
  expect(mountActivityItem(0).html()).not.toContain('00:00')
})

it('updates seconds to complete', async () => {
  const updateActivity = vi.spyOn(activities, 'updateActivity')
  const wrapper = mountActivityItem(SECONDS_IN_HOUR * 1)
  const secondsToComplete = SECONDS_IN_MINUTE * 30

  await wrapper.find('select').setValue(`${secondsToComplete}`)

  expect(wrapper.html()).toContain('-00:30:00').toContain('00:30')
  expect(updateActivity)
    .toBeCalledTimes(1)
    .toBeCalledWith({ ...activity, secondsToComplete }, { secondsToComplete })

  vi.restoreAllMocks()
})

// it('updates seconds to complete to zero if none is selected', async () => {
//   const updateActivity = vi.spyOn(activities, 'updateActivity')
//   const wrapper = mountActivityItem(SECONDS_IN_HOUR * 1)
//   const secondsToComplete = 0

//   await wrapper.find('select').setValue('')

//   expect(wrapper.html()).toContain('hh:mm')
//   expect(updateActivity)
//     .toBeCalledTimes(1)
//     .toBeCalledWith({ ...activity, secondsToComplete }, { secondsToComplete })

//   vi.restoreAllMocks()
// })

it('deletes activity', async () => {
  const resetTimelineItemActivities = vi.spyOn(timelineItems, 'resetTimelineItemActivities')
  const deleteActivity = vi.spyOn(activities, 'deleteActivity')

  await mountActivityItem(SECONDS_IN_HOUR * 1)
    .find('button')
    .trigger('click')

  expect(resetTimelineItemActivities)
    .toBeCalledTimes(1)
    .toBeCalledWith(timelineItems.timelineItems.value, activity)
  expect(deleteActivity).toBeCalledTimes(1).toBeCalledWith(activity)

  vi.restoreAllMocks()
})
