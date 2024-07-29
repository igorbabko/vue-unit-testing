import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseIcon from '../../src/components/BaseIcon.vue'
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
