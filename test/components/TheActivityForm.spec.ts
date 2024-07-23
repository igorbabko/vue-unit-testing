import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import TheActivityForm from '../../src/components/TheActivityForm.vue'
import * as activities from '../../src/activities'

it('enables submit button if input is filled', async () => {
  const wrapper = mount(TheActivityForm)

  expect(wrapper.find('button').attributes('disabled')).toBe('')

  await wrapper.find('input').setValue('Reading')

  expect(wrapper.find('button').attributes('disabled')).toBe(undefined)
})

it('creates activity when the form is submitted', async () => {
  const createActivity = vi.spyOn(activities, 'createActivity').mockImplementation(() => {})
  const wrapper = mount(TheActivityForm)
  const activityName = 'Reading'

  await wrapper.find('input').setValue(activityName)
  await wrapper.find('form').trigger('submit')

  expect(createActivity).toBeCalledTimes(1)
  expect(createActivity).toBeCalledWith({
    id: expect.any(String),
    name: activityName,
    secondsToComplete: 0
  })

  vi.restoreAllMocks()
})

it('disables submit button after form submission', async () => {
  const wrapper = mount(TheActivityForm)

  await wrapper.find('input').setValue('Reading')

  expect(wrapper.find('button').attributes('disabled')).toBe(undefined)

  await wrapper.find('form').trigger('submit')

  expect(wrapper.find('button').attributes('disabled')).toBe('')
})

it('scrolls page to the top after form submission', async () => {
  const scrollTo = vi.spyOn(window, 'scrollTo')
  const wrapper = mount(TheActivityForm)

  await wrapper.find('input').setValue('Reading')
  await wrapper.find('form').trigger('submit')

  expect(scrollTo).toBeCalledTimes(1)
  expect(scrollTo).toBeCalledWith(0, document.body.scrollHeight)

  vi.restoreAllMocks()
})
