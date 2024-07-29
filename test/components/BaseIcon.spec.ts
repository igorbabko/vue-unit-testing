import { mount, shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
import { ICONS } from '../../src/icons'
import { IconName } from '../../src/types'

it('renders icon with default classes', () => {
  const wrapper = shallowMount(BaseIcon, {
    props: { name: IconName.CLOCK }
  })

  expect(wrapper.classes()).toContain('h-8')
})

it('renders icon with custom classes', () => {
  const classes = 'h-12 text-purple-600'

  const wrapper = shallowMount(BaseIcon, {
    attrs: { class: classes },
    props: { name: IconName.CLOCK }
  })

  expect(wrapper.classes().join(' ')).toBe(classes)
})

it.each(Object.keys(ICONS))('renders %s icon', (name) => {
  const wrapper = mount(BaseIcon, {
    props: { name: name as IconName }
  })

  expect(wrapper.html()).toMatchSnapshot()
})
