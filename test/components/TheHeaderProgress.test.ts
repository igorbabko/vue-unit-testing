import { mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import TheHeaderProgress from '../../src/components/TheHeaderProgress.vue'
import { useTotalProgress } from '../../src/composables/total-progress'
import { HUNDRED_PERCENT, MEDIUM_PERCENT } from '../../src/constants'
import * as router from '../../src/router'
import { PageName, ProgressColorClass } from '../../src/types'

vi.mock('../../src/composables/total-progress', () => ({ useTotalProgress: vi.fn() }))

afterEach(() => vi.restoreAllMocks())

it('has href attribute with progress page hash', async () => {
  vi.mocked(useTotalProgress).mockReturnValue({})

  const wrapper = mount(TheHeaderProgress)

  expect(wrapper.attributes('href')).toBe(`#${PageName.PROGRESS}`)
})

it('shows current progress', () => {
  vi.mocked(useTotalProgress).mockReturnValue({ percentage: MEDIUM_PERCENT })

  const wrapper = mount(TheHeaderProgress)

  expect(wrapper.text()).toContain(`Progress: ${MEDIUM_PERCENT}%`)
})

it('uses proper progress color', () => {
  vi.mocked(useTotalProgress).mockReturnValue({
    percentage: MEDIUM_PERCENT,
    colorClass: ProgressColorClass.BLUE
  })

  const wrapper = mount(TheHeaderProgress)

  expect(wrapper.html()).toContain(ProgressColorClass.BLUE)
})

it('shows completion label when day is complete', () => {
  vi.mocked(useTotalProgress).mockReturnValue({ percentage: HUNDRED_PERCENT })

  const wrapper = mount(TheHeaderProgress)

  expect(wrapper.text()).toContain(`Day complete!`)
  expect(wrapper.findComponent(BaseIcon).exists()).toBe(true)
})

it('navigates to the progress page on click', async () => {
  vi.mocked(useTotalProgress).mockReturnValue({})

  const navigate = vi.spyOn(router, 'navigate')
  const wrapper = mount(TheHeaderProgress)

  await wrapper.trigger('click')

  expect(navigate).toBeCalledTimes(1)
  expect(navigate).toBeCalledWith(PageName.PROGRESS)
})
