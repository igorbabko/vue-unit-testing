// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import { ButtonType } from '../../src/types'

it("renders 'primary' button by default", () => {
  const label = 'Label'
  const primaryButtonClasses = 'bg-purple-500 enabled:hover:bg-purple-600 text-white'

  const wrapper = mount(BaseButton, {
    slots: { default: label }
  })

  expect(wrapper.html()).toContain(label)
  expect(wrapper.classes()).toEqual(expect.arrayContaining(primaryButtonClasses.split(' ')))
})

it.each([
  {
    type: ButtonType.PRIMARY,
    classes: 'bg-purple-500 enabled:hover:bg-purple-600 text-white'
  },
  {
    type: ButtonType.SUCCESS,
    classes: 'bg-green-500 enabled:hover:bg-green-600 text-white'
  },
  {
    type: ButtonType.WARNING,
    classes: 'bg-yellow-500 enabled:hover:bg-yellow-600 text-white'
  },
  {
    type: ButtonType.DANGER,
    classes: 'bg-red-500 enabled:hover:bg-red-600 text-white'
  },
  {
    type: ButtonType.NEUTRAL,
    classes: 'bg-gray-100 enabled:hover:bg-gray-200'
  }
])('renders $type button with label', ({ type, classes }) => {
  const label = 'Label'

  const wrapper = mount(BaseButton, {
    props: { type },
    slots: { default: label }
  })

  expect(wrapper.html()).toContain(label)
  expect(wrapper.classes()).toEqual(expect.arrayContaining(classes.split(' ')))
})
