import { shallowMount } from '@vue/test-utils'
import { afterAll, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import TheHeaderProgress from '../../src/components/TheHeaderProgress.vue'
import { useTotalProgress } from '../../src/composables/total-progress'
import { HUNDRED_PERCENT, MEDIUM_PERCENT } from '../../src/constants'
import * as router from '../../src/router'
import { PageName, ProgressColorClass } from '../../src/types'

vi.mock('../../src/composables/total-progress', () => {
  return {
    useTotalProgress: vi.fn(() => ({
      percentage: computed(() => MEDIUM_PERCENT),
      colorClass: computed(() => ProgressColorClass.BLUE)
    }))
  }
})

// vi.mock('../../src/composables/total-progress')

afterAll(() => {
  vi.restoreAllMocks()
})

it('has href attribute with progress page hash', () => {
  expect(shallowMount(TheHeaderProgress).attributes('href')).toBe(`#${PageName.PROGRESS}`)
})

it('shows current progress', () => {
  expect(shallowMount(TheHeaderProgress).text()).toContain(`Progress: ${MEDIUM_PERCENT}%`)
})

it('uses proper progress color', () => {
  expect(shallowMount(TheHeaderProgress).html()).toContain(ProgressColorClass.BLUE)
})

it('navigates to the progress page on click', () => {
  const navigateSpy = vi.spyOn(router, 'navigate')

  shallowMount(TheHeaderProgress).trigger('click')

  expect(navigateSpy).toBeCalledTimes(1)
  expect(navigateSpy).toBeCalledWith(PageName.PROGRESS)
})

it('shows completion label when day is complete', () => {
  vi.mocked(useTotalProgress).mockReturnValue({
    percentage: computed(() => HUNDRED_PERCENT),
    colorClass: computed(() => ProgressColorClass.BLUE)
  })

  const wrapper = shallowMount(TheHeaderProgress)

  expect(wrapper.text()).toContain(`Day complete!`)
  expect(wrapper.findComponent(BaseIcon).exists()).toBe(true)
})
