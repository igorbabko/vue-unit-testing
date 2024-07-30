import { mount, shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import BaseSelect from '../../src/components/BaseSelect.vue'
import { ButtonType, IconName } from '../../src/types'

it('renders select with reset button', () => {
  const wrapper = mount(BaseSelect, {
    props: {
      placeholder: '',
      options: [],
      selected: null
    }
  })

  expect(wrapper.findComponent(BaseButton).vm.type).toBe(ButtonType.NEUTRAL)
  expect(wrapper.findComponent(BaseIcon).vm.name).toBe(IconName.X_MARK)
})

it('renders select with placeholder', () => {
  const placeholder = 'Placeholder'

  const wrapper = shallowMount(BaseSelect, {
    props: {
      placeholder,
      options: [],
      selected: null
    }
  })

  expect(wrapper.text()).toContain(placeholder)
})

it('renders select with options', () => {
  const options = [
    { value: '1', label: 'Training' },
    { value: '2', label: 'Reading' },
    { value: '3', label: 'Coding' }
  ]

  const wrapper = shallowMount(BaseSelect, {
    props: {
      placeholder: '',
      selected: null,
      options
    }
  })

  options.forEach(({ value, label }) => {
    expect(wrapper.find(`option[value=${value}]`).exists()).toBe(true)
    expect(wrapper.find('select').text()).toContain(label)
  })
})

it('fires "select" event when option is selected', () => {
  const wrapper = shallowMount(BaseSelect, {
    props: {
      placeholder: '',
      selected: null,
      options: []
    }
  })

  wrapper.find('select').trigger('change')

  expect(wrapper.emitted().select).toHaveLength(1)
})

it('fires "select" event when reset button is pressed', () => {
  const wrapper = mount(BaseSelect, {
    props: {
      placeholder: '',
      selected: null,
      options: []
    }
  })

  wrapper.find('button').trigger('click')

  expect(wrapper.emitted().select).toHaveLength(1)
})
