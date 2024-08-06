import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TheHeader from '../../src/components/TheHeader.vue'
import TheHeaderProgress from '../../src/components/TheHeaderProgress.vue'
import TheLogo from '../../src/components/TheLogo.vue'

it('renders header', () => {
  const wrapper = shallowMount(TheHeader)

  expect(wrapper.findComponent(TheLogo).exists()).toBe(true)
  expect(wrapper.findComponent(TheHeaderProgress).exists()).toBe(true)
})
