import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TimelineHour from '../../src/components/TimelineHour.vue'
import { Hour } from '../../src/types'

function shallowMountTimelineHour(hour: Hour) {
  return shallowMount(TimelineHour, {
    props: { hour }
  })
}

it.each([0, 5, 10, 23] as Hour[])('shows formatted hour %i', (hour) => {
  expect(shallowMountTimelineHour(hour).text()).toContain(`${hour.toString().padStart(2, '0')}:00`)
})

it('has active state classes if timeline hour is current hour', () => {
  const classes = 'bg-purple-900 font-black text-white'

  vi.hoisted(() => vi.setSystemTime(new Date(`2024-04-10 08:00:00`)))

  expect(shallowMountTimelineHour(8).classes()).toEqual(expect.arrayContaining(classes.split(' ')))

  vi.useRealTimers()
})

it('has normal state classes if timeline hour is not current hour', () => {
  const classes = 'bg-gray-100 text-gray-500'

  vi.hoisted(() => vi.setSystemTime(new Date(`2024-04-10 08:00:00`)))

  expect(shallowMountTimelineHour(9).classes()).toEqual(expect.arrayContaining(classes.split(' ')))

  vi.useRealTimers()
})
