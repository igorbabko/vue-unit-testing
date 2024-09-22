import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import NavItem from '../../src/components/NavItem.vue'
import { NAV_ITEMS } from '../../src/constants'
import * as router from '../../src/router'
import * as timelineItems from '../../src/timeline-items'
import { type NavItem as NavItemType, PageName } from '../../src/types'

const timelineNavItem = NAV_ITEMS[0]

function shallowMountNavItem(navItem: NavItemType) {
  return shallowMount(NavItem, { props: { navItem } })
}

it('renders nav item', () => {
  const wrapper = shallowMountNavItem(timelineNavItem)

  expect(wrapper.text()).toContain(timelineNavItem.page)
  expect(wrapper.findComponent(BaseIcon).props('name')).toEqual(timelineNavItem.icon)
  expect(wrapper.find('a').attributes('href')).toBe(`#${timelineNavItem.page}`)
})

it('has hover state if nav item does not corresponds to current page', async () => {
  router.currentPage.value = PageName.TIMELINE

  const wrapper = shallowMountNavItem(timelineNavItem)

  expect(wrapper.find('a').classes()).not.toContain('hover:bg-gray-100')

  router.currentPage.value = PageName.ACTIVITIES

  await flushPromises()

  expect(wrapper.find('a').classes()).toContain('hover:bg-gray-100')
})

it('scrolls to current hour on click if nav item corresponds to timeline page and timeline page is open', () => {
  const scrollToCurrentHourSpy = vi.spyOn(timelineItems, 'scrollToCurrentHour')

  router.currentPage.value = PageName.TIMELINE

  const wrapper = shallowMountNavItem(timelineNavItem)

  wrapper.find('a').trigger('click')

  expect(scrollToCurrentHourSpy).toBeCalledTimes(1)
  expect(scrollToCurrentHourSpy).toBeCalledWith(true)

  vi.restoreAllMocks()
})

it('navigates to corresponding page on click', () => {
  const navigateSpy = vi.spyOn(router, 'navigate')

  router.currentPage.value = PageName.ACTIVITIES

  const wrapper = shallowMountNavItem(timelineNavItem)

  wrapper.find('a').trigger('click')

  expect(navigateSpy).toBeCalledTimes(1)
  expect(navigateSpy).toBeCalledWith(timelineNavItem.page)

  vi.restoreAllMocks()
})
