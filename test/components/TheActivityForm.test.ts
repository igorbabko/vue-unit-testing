import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TheActivityForm from '../../src/components/TheActivityForm.vue'

it('enables submit button if input is filled', async () => {
  const wrapper = mount(TheActivityForm)

  expect(wrapper.find('button').attributes()).toHaveProperty('disabled')

  await wrapper.find('input').setValue('Reading')

  expect(wrapper.find('button').attributes()).not.toHaveProperty('disabled')
})
