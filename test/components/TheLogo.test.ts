import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import TheLogo from '../../src/components/TheLogo.vue'
import * as router from '../../src/router'
import * as timelineItems from '../../src/timeline-items'
import { IconName, PageName } from '../../src/types'

it('renders logo', () => {
  expect(shallowMount(TheLogo).findComponent(BaseIcon).vm.name).toBe(IconName.CLOCK)
  // expect(wrapper.findComponent(BaseIcon).findComponent(ClockIcon).exists()).toBe(true)
})

it('has href attribute with timeline page hash', () => {
  expect(shallowMount(TheLogo).attributes('href')).toBe(`#${PageName.TIMELINE}`)
})

it('scrolls page to the top on click if timeline page is open', () => {
  const scrollToCurrentHour = vi.spyOn(timelineItems, 'scrollToCurrentHour')

  router.currentPage.value = PageName.TIMELINE

  shallowMount(TheLogo).trigger('click')

  expect(scrollToCurrentHour).toBeCalledTimes(1)
  expect(scrollToCurrentHour).toBeCalledWith(true)

  vi.restoreAllMocks()
})

it('navigates to timeline page on click if another page is open', () => {
  const navigate = vi.spyOn(router, 'navigate')

  router.currentPage.value = PageName.ACTIVITIES

  shallowMount(TheLogo).trigger('click')

  expect(navigate).toBeCalledTimes(1)
  expect(navigate).toBeCalledWith(PageName.TIMELINE)

  vi.restoreAllMocks()
})
