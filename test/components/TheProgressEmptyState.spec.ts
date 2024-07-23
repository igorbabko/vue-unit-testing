import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TheProgressEmptyState from '../../src/components/TheProgressEmptyState.vue'

it('renders progress empty state', () => {
  const wrapper = shallowMount(TheProgressEmptyState)

  expect(wrapper.html()).toContain("You don't have any tracked activities")
  expect(wrapper.find('img').attributes()).toMatchObject({
    // toEqual
    src: '/src/assets/img/no_tracked_activities.svg',
    alt: 'No tracked activities'
    // class: 'h-48'
  })
})
