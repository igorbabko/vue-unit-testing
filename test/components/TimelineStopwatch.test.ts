import { shallowMount } from '@vue/test-utils'
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

function getTimelineItem(overrides?: Partial<TimelineItem>): TimelineItem {
  return {
    hour: 0,
    activityId: null,
    activitySeconds: 0,
    isActive: false,
    ...overrides
  }
}

it('shows formatted activity seconds of timeline item', () => {
  const activitySeconds = MILLISECONDS_IN_SECOND * 10

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem: getTimelineItem({ activitySeconds }) }
  })

  expect(wrapper.text()).toContain(formatSeconds(activitySeconds))
})

it('has reset button disabled if timeline item has activity seconds = 0', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem: getTimelineItem({ activitySeconds: 0 }) }
  })

  expect(wrapper.findAllComponents(BaseButton)[0].props('type')).toBe(ButtonType.DANGER)
  expect(wrapper.findAllComponents(BaseIcon)[0].props('name')).toBe(IconName.ARROW_PATH)
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('true')
})

it('has reset button enabled if timeline item has activity seconds > 0', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem: getTimelineItem({ activitySeconds: 3600 }) }
  })

  expect(wrapper.findAllComponents(BaseButton)[0].props('type')).toBe(ButtonType.DANGER)
  expect(wrapper.findAllComponents(BaseIcon)[0].props('name')).toBe(IconName.ARROW_PATH)
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('false')
})

it('has pause button if timeline item is active', () => {
  const activeTimelineItem = getTimelineItem({ isActive: true })
  timelineItems.timelineItems.value = [activeTimelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem: activeTimelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.WARNING)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PAUSE)
})

it('has play button if timeline item is inactive', () => {
  const inactiveTimelineItem = getTimelineItem({ isActive: false })
  timelineItems.timelineItems.value = [inactiveTimelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem: inactiveTimelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PLAY)
})

it('has play button enabled if timeline item hour is current', () => {
  const currentHour = 8
  now.value = new Date(`2024-04-10 0${currentHour}:00:00`)

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem: getTimelineItem({ hour: currentHour }) }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseButton)[1].attributes('disabled')).toBe('false')
})

it('has play button disabled if timeline item hour is not current', () => {
  const currentHour = 8
  now.value = new Date(`2024-04-10 0${currentHour}:00:00`)

  const wrapper = shallowMount(TimelineStopwatch, {
    props: {
      timelineItem: getTimelineItem({ hour: (currentHour + 1) as Hour })
    }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseButton)[1].attributes('disabled')).toBe('true')
})

it('resets stopwatch', async () => {
  const resetTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'resetTimelineItemTimer')
  const timelineItem = getTimelineItem({
    isActive: true,
    activitySeconds: MILLISECONDS_IN_SECOND * 10
  })

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.text()).toContain(formatSeconds(timelineItem.activitySeconds))
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('false')

  await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

  expect(wrapper.text()).toContain(formatSeconds(0))
  expect(wrapper.findAllComponents(BaseButton)[0].attributes('disabled')).toBe('true')

  expect(resetTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(resetTimelineItemTimerSpy).toBeCalledWith(timelineItem)

  vi.restoreAllMocks()
})

it('stops stopwatch', async () => {
  vi.useFakeTimers()
  const stopTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'stopTimelineItemTimer')
  const activitySeconds = 5
  const timelineItem = getTimelineItem({ activitySeconds, isActive: true })
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.text()).toContain(formatSeconds(activitySeconds))

  wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')
  await vi.advanceTimersByTime(MILLISECONDS_IN_SECOND * 10)

  expect(wrapper.text()).toContain(formatSeconds(activitySeconds))

  expect(stopTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(stopTimelineItemTimerSpy).toBeCalledWith()

  vi.restoreAllMocks()
  vi.useRealTimers()
})

it('starts stopwatch', async () => {
  vi.useFakeTimers()
  const startTimelineItemTimerSpy = vi.spyOn(timelineItemTimer, 'startTimelineItemTimer')
  const activitySeconds = 0
  const timelineItem = getTimelineItem({ activitySeconds, isActive: false })
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.text()).toContain(formatSeconds(0))

  wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')
  await vi.advanceTimersByTime(MILLISECONDS_IN_SECOND * 5)

  expect(wrapper.text()).toContain(formatSeconds(activitySeconds + 5))

  expect(startTimelineItemTimerSpy).toBeCalledTimes(1)
  expect(startTimelineItemTimerSpy).toBeCalledWith(timelineItem)

  vi.restoreAllMocks()
  vi.useRealTimers()
})

it('changes play button to pause button when stopwatch is started', async () => {
  const timelineItem = getTimelineItem({ isActive: false })
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PLAY)

  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.WARNING)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PAUSE)
})

it('changes pause button to play button when stopwatch is paused', async () => {
  const timelineItem = getTimelineItem({ isActive: true })
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.WARNING)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PAUSE)

  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PLAY)
})

it('changes pause button to play button when stopwatch is reset', async () => {
  const timelineItem = getTimelineItem({ isActive: true })
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    global: { renderStubDefaultSlot: true },
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.WARNING)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PAUSE)

  await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].props('type')).toBe(ButtonType.SUCCESS)
  expect(wrapper.findAllComponents(BaseIcon)[1].props('name')).toBe(IconName.PLAY)
})
