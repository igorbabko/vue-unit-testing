import { shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import NavItem from '../../src/components/NavItem.vue'
import { NAV_ITEMS } from '../../src/constants'
import * as timelineItems from '../../src/timeline-items'
import { PageName } from '../../src/types'
import * as router from '../../src/router'
import { nextTick } from 'vue'

const navItemProp = NAV_ITEMS[0]

it('renders nav item', () => {
  const wrapper = shallowMount(NavItem, {
    props: { navItem: navItemProp }
  })

  expect(wrapper.html()).toContain(navItemProp.page)
  expect(wrapper.findComponent(BaseIcon).vm.name).toEqual(navItemProp.icon)
  expect(wrapper.find('a').attributes('href')).toBe(`#${navItemProp.page}`)
})

it('does not have hover state if nav item corresponds to current page', async () => {
  router.currentPage.value = PageName.TIMELINE

  const wrapper = shallowMount(NavItem, {
    props: { navItem: navItemProp }
  })

  expect(wrapper.find('a').classes()).not.toContain('hover:bg-gray-100')

  router.currentPage.value = PageName.ACTIVITIES

  await nextTick()

  expect(wrapper.find('a').classes()).toContain('hover:bg-gray-100')
})

it('scrolls to current hour on click if nav item corresponds to timeline page and timeline page is open', async () => {
  const scrollToCurrentHour = vi.spyOn(timelineItems, 'scrollToCurrentHour')

  router.currentPage.value = PageName.TIMELINE

  const wrapper = shallowMount(NavItem, {
    props: { navItem: navItemProp }
  })

  await wrapper.find('a').trigger('click')

  expect(scrollToCurrentHour).toBeCalledTimes(1)
  expect(scrollToCurrentHour).toBeCalledWith(true)
})

it('navigates to corresponding page on click', async () => {
  const navigate = vi.spyOn(router, 'navigate')

  router.currentPage.value = PageName.ACTIVITIES

  const wrapper = shallowMount(NavItem, {
    props: { navItem: navItemProp }
  })

  await wrapper.find('a').trigger('click')

  expect(navigate).toBeCalledTimes(1)
  expect(navigate).toBeCalledWith(navItemProp.page)
})
