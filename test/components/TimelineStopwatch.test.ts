import { shallowMount, VueWrapper } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import TimelineStopwatch from '../../src/components/TimelineStopwatch.vue'
import { MILLISECONDS_IN_SECOND } from '../../src/constants'
import { formatSeconds } from '../../src/functions'
import { now } from '../../src/time'
import * as timelineItemTimer from '../../src/timeline-item-timer'
import * as timelineItems from '../../src/timeline-items'
import { ButtonType, IconName, type Hour, type TimelineItem } from '../../src/types'

function shallowMountTimelineStopwatch(timelineItemOverrides: Partial<TimelineItem> = {}) {
  const timelineItem = isTimelineItem(timelineItemOverrides)
    ? timelineItemOverrides
    : createTimelineItem(timelineItemOverrides)

  timelineItems.timelineItems.value = [timelineItem]

  return shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem }
  })
}

function isTimelineItem(object: Partial<TimelineItem>): object is TimelineItem {
  return (
    'hour' in object &&
    'activityId' in object &&
    'activitySeconds' in object &&
    'isActive' in object
  )
}

function createTimelineItem(overrides: Partial<TimelineItem> = {}): TimelineItem {
  return {
    hour: 0,
    activityId: null,
    activitySeconds: 0,
    isActive: false,
    ...overrides
  }
}

async function clickResetButton(wrapper: VueWrapper) {
  await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')
}

async function clickPlayButton(wrapper: VueWrapper) {
  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')
}

async function clickPauseButton(wrapper: VueWrapper) {
  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')
}

function assertPlayButtonVisible(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PLAY)
}

function assertPauseButtonVisible(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.WARNING)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PAUSE)
}

function assertResetButtonVisible(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[0].props('type')).toBe(ButtonType.DANGER)
  expect(wrapper.findAllComponents(BaseIcon)[0].props('name')).toBe(IconName.ARROW_PATH)
}

function assertPlayButtonEnabled(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[1].attributes('disabled')).toBe('false')
}

function assertPlayButtonDisabled(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[1].attributes('disabled')).toBe('true')
}

function assertResetButtonEnabled(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('false')
}

function assertResetButtonDisabled(wrapper: VueWrapper) {
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('true')
}

function assertFormattedActivitySeconds(wrapper: VueWrapper, activitySeconds: number) {
  expect(wrapper.text()).toContain(formatSeconds(activitySeconds))
}

it('shows formatted activity seconds of timeline item', () => {
  const activitySeconds = MILLISECONDS_IN_SECOND * 10

  assertFormattedActivitySeconds(
    shallowMountTimelineStopwatch({ activitySeconds }),
    activitySeconds
  )
})

it('has reset button disabled if timeline item has activity seconds = 0', () => {
  const wrapper = shallowMountTimelineStopwatch({ activitySeconds: 0 })

  assertResetButtonVisible(wrapper)
  assertResetButtonDisabled(wrapper)
})

it('has reset button enabled if timeline item has activity seconds > 0', () => {
  const wrapper = shallowMountTimelineStopwatch({ activitySeconds: MILLISECONDS_IN_SECOND * 10 })

  assertResetButtonVisible(wrapper)
  assertResetButtonEnabled(wrapper)
})

it('has pause button if timeline item is active', () => {
  assertPauseButtonVisible(shallowMountTimelineStopwatch({ isActive: true }))
})

it('has play button if timeline item is inactive', () => {
  assertPlayButtonVisible(shallowMountTimelineStopwatch({ isActive: false }))
})

it('has play button enabled if timeline item hour is current', () => {
  const hour = 8
  now.value = new Date(`2024-04-10 0${hour}:00:00`)

  const wrapper = shallowMountTimelineStopwatch({ hour })

  assertPlayButtonVisible(wrapper)
  assertPlayButtonEnabled(wrapper)
})

it('has play button disabled if timeline item hour is not current', () => {
  const currentHour = 8
  now.value = new Date(`2024-04-10 0${currentHour}:00:00`)

  const wrapper = shallowMountTimelineStopwatch({ hour: (currentHour + 1) as Hour })

  assertPlayButtonVisible(wrapper)
  assertPlayButtonDisabled(wrapper)
})

it('resets stopwatch', async () => {
  const resetTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'resetTimelineItemTimer')
  const timelineItem = createTimelineItem({
    isActive: true,
    activitySeconds: MILLISECONDS_IN_SECOND * 10
  })
  const wrapper = shallowMountTimelineStopwatch(timelineItem)
  assertFormattedActivitySeconds(wrapper, timelineItem.activitySeconds)
  assertResetButtonEnabled(wrapper)

  await clickResetButton(wrapper)

  assertFormattedActivitySeconds(wrapper, 0)
  assertResetButtonDisabled(wrapper)
  expect(resetTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(resetTimelineItemTimerSpy).toBeCalledWith(timelineItem)
  vi.restoreAllMocks()
})

it('stops stopwatch', async () => {
  vi.useFakeTimers()
  const stopTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'stopTimelineItemTimer')
  const activitySeconds = 5
  const wrapper = shallowMountTimelineStopwatch({ activitySeconds, isActive: true })
  assertFormattedActivitySeconds(wrapper, activitySeconds)

  await clickPauseButton(wrapper)
  await vi.advanceTimersByTime(MILLISECONDS_IN_SECOND * 10)

  assertFormattedActivitySeconds(wrapper, activitySeconds)
  expect(stopTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(stopTimelineItemTimerSpy).toBeCalledWith()
  vi.restoreAllMocks().useRealTimers()
})

it('starts stopwatch', async () => {
  vi.useFakeTimers()
  const startTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'startTimelineItemTimer')
  const activitySeconds = 0
  const timelineItem = createTimelineItem({ activitySeconds, isActive: false })
  const wrapper = shallowMountTimelineStopwatch(timelineItem)
  assertFormattedActivitySeconds(wrapper, 0)

  await clickPlayButton(wrapper)
  await vi.advanceTimersByTime(MILLISECONDS_IN_SECOND * 5)

  assertFormattedActivitySeconds(wrapper, activitySeconds + 5)
  expect(startTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(startTimelineItemTimerSpy).toBeCalledWith(timelineItem)
  vi.restoreAllMocks().useRealTimers()
})

it('changes play button to pause button when stopwatch is started', async () => {
  const wrapper = shallowMountTimelineStopwatch({ isActive: false })
  assertPlayButtonVisible(wrapper)

  await clickPlayButton(wrapper)

  assertPauseButtonVisible(wrapper)
})

it('changes pause button to play button when stopwatch is paused', async () => {
  const wrapper = shallowMountTimelineStopwatch({ isActive: true })
  assertPauseButtonVisible(wrapper)

  await clickPauseButton(wrapper)

  assertPlayButtonVisible(wrapper)
})

it('changes pause button to play button when stopwatch is reset', async () => {
  const wrapper = shallowMountTimelineStopwatch({ isActive: true })
  assertPauseButtonVisible(wrapper)

  await clickResetButton(wrapper)

  assertPlayButtonVisible(wrapper)
})
