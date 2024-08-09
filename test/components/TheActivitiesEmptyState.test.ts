import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TheActivitiesEmptyState from '../../src/components/TheActivitiesEmptyState.vue'

it('renders activities empty state', () => {
  const wrapper = shallowMount(TheActivitiesEmptyState)

  expect(wrapper.text()).toContain("You don't have any activities")
  expect(wrapper.find('img').attributes()).toMatchObject({
    src: '/src/assets/img/no_activities.svg',
    alt: 'No activities'
  })
})
