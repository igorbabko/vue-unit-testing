import { expect, it, vi } from 'vitest'
import { MILLISECONDS_IN_SECOND } from '../src/constants'
import { endOfHour, isToday, toSeconds, today, tomorrow } from '../src/time'

it.each([
  [new Date('1990-01-01'), new Date('1990-01-01')],
  [new Date('2024-03-08'), new Date('2024-03-08')],
  [new Date('2030-05-12'), new Date('2030-05-12')]
])('returns current date: %o', (date, expectedDate) => {
  vi.setSystemTime(date)

  expect(today()).toEqual(expectedDate)

  vi.useRealTimers()
})

it.each([
  [new Date('1990-01-01'), new Date('1990-01-02')],
  [new Date('2024-03-08'), new Date('2024-03-09')],
  [new Date('2030-05-12'), new Date('2030-05-13')]
])('returns date of tomorrow: %o', (date, expectedDate) => {
  vi.setSystemTime(date)

  expect(tomorrow()).toEqual(expectedDate)

  vi.useRealTimers()
})

it.each([
  [new Date('2024-04-10T10:15:00'), new Date('2024-04-10T11:00:00')],
  [new Date('2024-04-10T20:00:00'), new Date('2024-04-10T21:00:00')],
  [new Date('2024-04-10T12:59:00'), new Date('2024-04-10T13:00:00')]
])('endOfHour(%o) -> %o', (date, expectedDate) => {
  expect(endOfHour(date)).toEqual(expectedDate)
})

it('checks if passed date is today', () => {
  const dateA = new Date('2024-01-01')
  const dateB = new Date('2024-01-02')

  vi.setSystemTime(dateA)

  expect(isToday(dateA)).toBe(true)
  expect(isToday(dateB)).toBe(false)

  vi.useRealTimers()
})

it.each([
  [-MILLISECONDS_IN_SECOND * 10, -10],
  [-MILLISECONDS_IN_SECOND * 1, -1],
  [MILLISECONDS_IN_SECOND * 0, 0],
  [MILLISECONDS_IN_SECOND * 1, 1],
  [MILLISECONDS_IN_SECOND * 10, 10]
])('toSeconds(%i) -> %i', (milliseconds, seconds) => {
  expect(toSeconds(milliseconds)).toBe(seconds)
})
