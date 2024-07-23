import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import BaseIcon from '../../src/components/BaseIcon.vue'
import BaseSelect from '../../src/components/BaseSelect.vue'
import { ButtonType, IconName, SelectOption } from '../../src/types'

type MountOptions = {
  options?: SelectOption[]
  placeholder?: string
}

function shallowMountSelect(mountOptions?: MountOptions) {
  return mountSelect(mountOptions, true)
}

function mountSelect(mountOptions: MountOptions = {}, shallow: boolean = false) {
  return mount(BaseSelect, {
    shallow,
    props: {
      placeholder: mountOptions.placeholder ?? '',
      options: mountOptions.options ?? [],
      selected: null
    }
  })
}

const options = [
  { value: '1', label: 'Training' },
  { value: '2', label: 'Reading' },
  { value: '3', label: 'Coding' }
]

it('renders select with reset button', () => {
  const wrapper = mountSelect()

  expect(wrapper.findComponent(BaseButton).vm.type).toBe(ButtonType.NEUTRAL)
  expect(wrapper.findComponent(BaseIcon).vm.name).toBe(IconName.X_MARK)
})

it('renders select with placeholder', () => {
  const placeholder = 'Paceholder'

  expect(shallowMountSelect({ placeholder }).text()).toContain(placeholder)
})

it('renders select with options', () => {
  const wrapper = shallowMountSelect({ options })

  options.forEach(({ value, label }) => {
    expect(wrapper.find(`option[value=${value}]`).attributes('value')).toContain(value)
    expect(wrapper.find('select').text()).toContain(label)
  })
})

it('fires "select" event when option is selected', async () => {
  const wrapper = shallowMountSelect()

  await wrapper.find('select').trigger('change')

  expect(wrapper.emitted()).toHaveProperty('select')
  expect(wrapper.emitted().select).toHaveLength(1)
})

it('fires "select" event when reset button is pressed', async () => {
  const wrapper = mountSelect()

  await wrapper.find('button').trigger('click')

  expect(wrapper.emitted()).toHaveProperty('select')
  expect(wrapper.emitted().select).toHaveLength(1)
  expect((wrapper.emitted() as { select: [null[]] }).select[0][0]).toEqual(null)
  expect(wrapper.find('select').element.value).toEqual('')
})
