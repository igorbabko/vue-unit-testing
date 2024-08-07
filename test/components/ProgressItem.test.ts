import { shallowMount } from '@vue/test-utils'
import { afterAll, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import ProgressItem from '../../src/components/ProgressItem.vue'
import { useProgress } from '../../src/composables/progress'
import { HUNDRED_PERCENT, MEDIUM_PERCENT, SECONDS_IN_HOUR } from '../../src/constants'
import { formatSeconds } from '../../src/functions'
import { ProgressColorClass } from '../../src/types'

vi.mock('../../src/composables/progress', () => {
  return {
    useProgress: vi.fn(() => ({
      percentage: computed(() => MEDIUM_PERCENT),
      colorClass: computed(() => ProgressColorClass.BLUE),
      trackedActivitySeconds: computed(() => SECONDS_IN_HOUR * 1)
    }))
  }
})

const activity = {
  id: '1',
  name: 'Reading',
  secondsToComplete: SECONDS_IN_HOUR * 1
}

function shallowMountProgressItem() {
  return shallowMount(ProgressItem, {
    props: { activity }
  })
}

afterAll(() => {
  vi.restoreAllMocks()
})

it('shows activity name', () => {
  expect(shallowMountProgressItem().text()).toContain(activity.name)
})

it('shows activity completion percentage', () => {
  expect(shallowMountProgressItem().text()).toContain(MEDIUM_PERCENT)
})

it('shows tracked activity seconds and activity seconds to complete', () => {
  expect(shallowMountProgressItem().text()).toContain(
    `${formatSeconds(SECONDS_IN_HOUR * 1)} / ${formatSeconds(activity.secondsToComplete)}`
  )
})

it('shows incomplete progress bar if percentage is < 100%', () => {
  // expect(wrapper.html()).toContain(ProgressColorClass.BLUE)
  // expect(wrapper.html()).toContain(`width: ${Math.min(MEDIUM_PERCENT, HUNDRED_PERCENT)}%`)

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.BLUE}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${MEDIUM_PERCENT}%`)
})

it('shows complete progress bar if percentage is 100%', () => {
  vi.mocked(useProgress).mockReturnValue({
    percentage: computed(() => HUNDRED_PERCENT),
    colorClass: computed(() => ProgressColorClass.BLUE),
    trackedActivitySeconds: computed(vi.fn())
  })

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.BLUE}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${HUNDRED_PERCENT}%`)
})

it('shows complete progress bar if percentage is > 100%', () => {
  vi.mocked(useProgress).mockReturnValue({
    percentage: computed(() => HUNDRED_PERCENT + 1),
    colorClass: computed(() => ProgressColorClass.BLUE),
    trackedActivitySeconds: computed(vi.fn())
  })

  const progressBarElement = shallowMountProgressItem().find(`.${ProgressColorClass.BLUE}`)
    .element as HTMLElement

  expect(progressBarElement.style.width).toContain(`${HUNDRED_PERCENT}%`)
})
