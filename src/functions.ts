import { HUNDRED_PERCENT, LOW_PERCENT, MEDIUM_PERCENT, MILLISECONDS_IN_SECOND } from './constants'
import { ProgressColorClass } from './types'

export function formatSecondsWithSign(seconds: number): string {
  return `${seconds >= 0 ? '+' : '-'}${formatSeconds(seconds)}`
}

export function formatSeconds(seconds: number): string {
  const date = new Date()

  date.setTime(Math.abs(seconds) * MILLISECONDS_IN_SECOND)

  const utc = date.toUTCString()

  return utc.substring(utc.indexOf(':') - 2, utc.indexOf(':') + 6)
}

export function normalizeSelectValue(value: string | null): number | string | null {
  return value === null || isNaN(Number(value)) ? value : +value
}

export function getProgressColorClass(percentage: number): ProgressColorClass {
  if (percentage < LOW_PERCENT) return ProgressColorClass.RED
  if (percentage < MEDIUM_PERCENT) return ProgressColorClass.YELLOW
  if (percentage < HUNDRED_PERCENT) return ProgressColorClass.BLUE

  return ProgressColorClass.GREEN
}

export function id(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
