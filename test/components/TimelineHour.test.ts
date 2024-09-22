import { shallowMount } from '@vue/test-utils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import TimelineHour from '../../src/components/TimelineHour.vue'
import * as timelineItems from '../../src/timeline-items'
import { Hour } from '../../src/types'

function shallowMountTimelineHour(hour: Hour) {
  return shallowMount(TimelineHour, {
    props: { hour }
  })
}

it.each([0, 5, 10, 23] as Hour[])('shows formatted hour %i', (hour) => {
  expect(shallowMountTimelineHour(hour).text()).toContain(`${hour.toString().padStart(2, '0')}:00`)
})

it('scrolls to particular hour on click', () => {
  const scrollToHourSpy = vi.spyOn(timelineItems, 'scrollToHour')
  const hour = 8

  shallowMountTimelineHour(hour).trigger('click')

  expect(scrollToHourSpy).toBeCalledTimes(1)
  expect(scrollToHourSpy).toBeCalledWith(hour)

  vi.restoreAllMocks()
})

describe('classes', () => {
  vi.hoisted(() => vi.setSystemTime(new Date(`2024-04-10 08:00:00`)))

  const currentHour = 8

  it('has active state classes if timeline hour is current', () => {
    const classes = 'bg-purple-900 font-black text-white'
    const wrapper = shallowMountTimelineHour(currentHour)

    expect(wrapper.classes()).toEqual(expect.arrayContaining(classes.split(' ')))
  })

  it('has normal state classes if timeline hour is not current', () => {
    const classes = 'bg-gray-100 text-gray-500'
    const wrapper = shallowMountTimelineHour((currentHour + 1) as Hour)

    expect(wrapper.classes()).toEqual(expect.arrayContaining(classes.split(' ')))
  })

  afterAll(() => {
    vi.useRealTimers()
  })
})
