// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'

it('renders primary button by default', () => {
  const label = 'Label'
  const primaryButtonClasses = 'bg-purple-500 enabled:hover:bg-purple-600 text-white'

  const wrapper = mount(BaseButton, {
    slots: { default: label }
  })

  expect(wrapper.html()).toContain(label)
  expect(wrapper.classes()).toEqual(expect.arrayContaining(primaryButtonClasses.split(' ')))
})
