import { shallowMount } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'
import RemainingActivitySeconds from '../../src/components/RemainingActivitySeconds.vue'
import { SECONDS_IN_HOUR } from '../../src/constants'
import { formatSecondsWithSign } from '../../src/functions'
import * as timelineItems from '../../src/timeline-items'

const activity = {
  id: '1',
  name: 'Reading',
  secondsToComplete: SECONDS_IN_HOUR * 1
}

function shallowMountRemainingActivitySeconds() {
  return shallowMount(RemainingActivitySeconds, {
    props: { activity }
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

it('shows remaining activity seconds', () => {
  const trackedActivitySeconds = SECONDS_IN_HOUR * 2

  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  expect(shallowMountRemainingActivitySeconds().text()).toContain(
    formatSecondsWithSign(trackedActivitySeconds - activity.secondsToComplete)
  )
})

it('has positive state classes if tracked activity seconds are >= activity seconds to complete', () => {
  const classes = 'bg-green-100 text-green-600'
  const trackedActivitySeconds = SECONDS_IN_HOUR * 2

  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  expect(shallowMountRemainingActivitySeconds().classes()).toEqual(
    expect.arrayContaining(classes.split(' '))
  )
})

it('has negative state classes if tracked activity seconds are < activity seconds to complete', () => {
  const classes = 'bg-red-100 text-red-600'
  const trackedActivitySeconds = SECONDS_IN_HOUR * 0.5

  vi.spyOn(timelineItems, 'calculateTrackedActivitySeconds').mockReturnValue(trackedActivitySeconds)

  expect(shallowMountRemainingActivitySeconds().classes()).toEqual(
    expect.arrayContaining(classes.split(' '))
  )
})
