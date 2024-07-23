import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SECONDS_IN_HOUR } from '../src/constants'
import {
  calculateTrackedActivitySeconds,
  resetTimelineItemActivities,
  updateTimelineItem
} from '../src/timeline-items'
import type { Activity, TimelineItem } from '../src/types'

describe('updateTimelineItem', () => {
  const updatedFields: TimelineItem = {
    hour: 2,
    activityId: '2',
    activitySeconds: SECONDS_IN_HOUR * 1,
    isActive: true
  }

  it('updates original timeline item', () => {
    const timelineItem: TimelineItem = {
      hour: 1,
      activityId: '1',
      activitySeconds: SECONDS_IN_HOUR * 0,
      isActive: false
    }

    updateTimelineItem(timelineItem, updatedFields)

    expect(timelineItem).toEqual(updatedFields)
  })

  it('returns updated timeline item', () => {
    const timelineItem: TimelineItem = {
      hour: 1,
      activityId: '1',
      activitySeconds: SECONDS_IN_HOUR * 0,
      isActive: false
    }

    expect(updateTimelineItem(timelineItem, updatedFields)).toEqual(updatedFields)
  })
})

describe('timeline items', () => {
  const trainingActivity: Activity = {
    id: '1',
    name: 'Training',
    secondsToComplete: SECONDS_IN_HOUR * 1
  }
  const readingActivity: Activity = {
    id: '2',
    name: 'Reading',
    secondsToComplete: SECONDS_IN_HOUR * 2
  }
  let timelineItems: TimelineItem[]

  beforeEach(() => {
    timelineItems = [
      {
        hour: 1,
        activityId: trainingActivity.id,
        activitySeconds: SECONDS_IN_HOUR * 0.5,
        isActive: false
      },
      {
        hour: 2,
        activityId: trainingActivity.id,
        activitySeconds: SECONDS_IN_HOUR * 1,
        isActive: false
      },
      {
        hour: 3,
        activityId: readingActivity.id,
        activitySeconds: SECONDS_IN_HOUR * 1,
        isActive: true
      }
    ]
  })

  it('resets timeline item activities', () => {
    const date = new Date('2024-04-10T02:00:00')

    vi.setSystemTime(date)

    resetTimelineItemActivities(timelineItems, trainingActivity)

    expect(timelineItems).toMatchInlineSnapshot(`
      [
        {
          "activityId": null,
          "activitySeconds": 0,
          "hour": 1,
          "isActive": false,
        },
        {
          "activityId": null,
          "activitySeconds": 3600,
          "hour": 2,
          "isActive": false,
        },
        {
          "activityId": "2",
          "activitySeconds": 3600,
          "hour": 3,
          "isActive": true,
        },
      ]
    `)

    vi.useRealTimers()
  })

  it('calculates tracked activity seconds', () => {
    const trackedTrainingActivitySeconds = calculateTrackedActivitySeconds(
      timelineItems,
      trainingActivity
    )
    const trackedReadingActivitySeconds = calculateTrackedActivitySeconds(
      timelineItems,
      readingActivity
    )

    expect(trackedTrainingActivitySeconds).toBe(SECONDS_IN_HOUR * 1.5)
    expect(trackedReadingActivitySeconds).toBe(SECONDS_IN_HOUR * 1)
  })
})
