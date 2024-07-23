import { beforeEach, describe, expect, it } from 'vitest'
import { calculateActivityCompletionPercentage, updateActivity } from '../src/activities'
import { HUNDRED_PERCENT, SECONDS_IN_HOUR } from '../src/constants'
import type { Activity } from '../src/types'

let activity: Activity

beforeEach(() => {
  activity = {
    id: '1',
    name: 'Training',
    secondsToComplete: SECONDS_IN_HOUR * 1
  }
})

describe('updateActivity', () => {
  const updatedFields: Activity = {
    id: '2',
    name: 'Reading',
    secondsToComplete: SECONDS_IN_HOUR * 2
  }

  it('updates original activity', () => {
    updateActivity(activity, updatedFields)

    expect(activity).toEqual(updatedFields)
  })

  it('returns updated activity', () => {
    expect(updateActivity(activity, updatedFields)).toEqual(updatedFields)
  })
})

it.each([
  [SECONDS_IN_HOUR * 0, 0],
  [SECONDS_IN_HOUR * 0.5, 50],
  [SECONDS_IN_HOUR * 1, HUNDRED_PERCENT]
])('calculateActivityCompletionPercentage(activity, %i) -> %i', (trackedSeconds, percentage) => {
  expect(calculateActivityCompletionPercentage(activity, trackedSeconds)).toBe(percentage)
})
