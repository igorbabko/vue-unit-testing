import { shallowMount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import RemainingActivitySeconds from '../../src/components/RemainingActivitySeconds.vue'
import { SECONDS_IN_HOUR } from '../../src/constants'
import { formatSecondsWithSign } from '../../src/functions'
import * as timelineItems from '../../src/timeline-items'
import { Activity } from '../../src/types'

function shallowMountRemainingActivitySeconds(activityOverrides: Partial<Activity> = {}) {
  return shallowMount(RemainingActivitySeconds, {
    props: {
      activity: {
        id: '',
        name: '',
        secondsToComplete: 0,
        ...activityOverrides
      }
    }
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

it('shows remaining activity seconds', () => {
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const trackedActivitySeconds = SECONDS_IN_HOUR * 2
  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  const wrapper = shallowMountRemainingActivitySeconds({ secondsToComplete })

  expect(wrapper.text()).toContain(
    formatSecondsWithSign(trackedActivitySeconds - secondsToComplete)
  )
})

it('has positive state classes if tracked activity seconds are >= activity seconds to complete', () => {
  const classes = 'bg-green-100 text-green-600'
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const trackedActivitySeconds = secondsToComplete * 2
  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  const wrapper = shallowMountRemainingActivitySeconds({ secondsToComplete })

  expect(wrapper.classes()).toEqual(expect.arrayContaining(classes.split(' ')))
})

it('has negative state classes if tracked activity seconds are < activity seconds to complete', () => {
  const classes = 'bg-red-100 text-red-600'
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const trackedActivitySeconds = secondsToComplete / 2
  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  const wrapper = shallowMountRemainingActivitySeconds({ secondsToComplete })

  expect(wrapper.classes()).toEqual(expect.arrayContaining(classes.split(' ')))
})
