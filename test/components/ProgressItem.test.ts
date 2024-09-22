import { shallowMount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import ProgressItem from '../../src/components/ProgressItem.vue'
import { useProgress } from '../../src/composables/progress'
import { HUNDRED_PERCENT, LOW_PERCENT, MEDIUM_PERCENT, SECONDS_IN_HOUR } from '../../src/constants'
import { formatSeconds } from '../../src/functions'
import { Activity, ProgressColorClass } from '../../src/types'

vi.mock('../../src/composables/progress')

function shallowMountProgressItem(activityOverrides: Partial<Activity> = {}) {
  return shallowMount(ProgressItem, {
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

function mockUseProgressComposable(overrides: Partial<ReturnType<typeof useProgress>> = {}) {
  vi.mocked(useProgress).mockReturnValue({
    colorClass: computed(() => ProgressColorClass.GREEN),
    percentage: computed(() => HUNDRED_PERCENT),
    trackedActivitySeconds: computed(vi.fn()),
    ...overrides
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

it('shows activity name', () => {
  mockUseProgressComposable()
  const name = 'Reading'

  expect(shallowMountProgressItem({ name }).text()).toContain(name)
})

it('shows activity completion percentage', () => {
  mockUseProgressComposable({ percentage: computed(() => LOW_PERCENT) })

  expect(shallowMountProgressItem().text()).toContain(LOW_PERCENT)
})

it('shows tracked activity seconds and activity seconds to complete', () => {
  const secondsToComplete = SECONDS_IN_HOUR * 1
  const trackedActivitySeconds = secondsToComplete / 2
  mockUseProgressComposable({ trackedActivitySeconds: computed(() => trackedActivitySeconds) })

  expect(shallowMountProgressItem({ secondsToComplete }).text()).toContain(
    `${formatSeconds(trackedActivitySeconds)} / ${formatSeconds(secondsToComplete)}`
  )
})

it('shows incomplete progress bar if percentage is < 100%', () => {
  mockUseProgressComposable({
    colorClass: computed(() => ProgressColorClass.BLUE),
    percentage: computed(() => MEDIUM_PERCENT)
  })

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.BLUE}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${MEDIUM_PERCENT}%`)
})

it('shows complete progress bar if percentage is = 100%', () => {
  mockUseProgressComposable({
    colorClass: computed(() => ProgressColorClass.GREEN),
    percentage: computed(() => HUNDRED_PERCENT)
  })

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.GREEN}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${HUNDRED_PERCENT}%`)
})

it('shows complete progress bar if percentage is > 100%', () => {
  mockUseProgressComposable({
    colorClass: computed(() => ProgressColorClass.GREEN),
    percentage: computed(() => HUNDRED_PERCENT + 1)
  })

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.GREEN}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${HUNDRED_PERCENT}%`)
})
