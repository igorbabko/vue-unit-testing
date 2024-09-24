import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import NavItem from '../../src/components/NavItem.vue'
import { NAV_ITEMS } from '../../src/constants'
import { currentPage } from '../../src/router'
import { PageName } from '../../src/types'

const timelineNavItem = NAV_ITEMS[0]

it('renders nav item', () => {
  const wrapper = shallowMount(NavItem, {
    props: {
      navItem: timelineNavItem
    }
  })

  expect(wrapper.text()).toContain(timelineNavItem.page)
  expect(wrapper.findComponent(BaseIcon).props('name')).toEqual(timelineNavItem.icon)
  expect(wrapper.find('a').attributes('href')).toBe(`#${timelineNavItem.page}`)
})

it('has hover state if nav item does not correspond to current page', async () => {
  currentPage.value = PageName.TIMELINE
  const hoverClass = 'hover:bg-gray-100'
  const wrapper = shallowMount(NavItem, {
    props: {
      navItem: timelineNavItem
    }
  })
  expect(wrapper.find('a').classes()).not.toContain(hoverClass)

  currentPage.value = PageName.ACTIVITIES
  await flushPromises()

  expect(wrapper.find('a').classes()).toContain(hoverClass)
})
