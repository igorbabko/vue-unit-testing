import { mount, shallowMount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import BaseButton from '../../src/components/BaseButton.vue'
import TimelineStopwatch from '../../src/components/TimelineStopwatch.vue'
import { SECONDS_IN_HOUR } from '../../src/constants'
import { formatSeconds } from '../../src/functions'
import * as timelineItems from '../../src/timeline-items'
import { ButtonType, type TimelineItem } from '../../src/types'

const timelineItem: TimelineItem = {
  hour: 8,
  activityId: '2',
  activitySeconds: 0,
  isActive: false
}

const activeTimelineItem: TimelineItem = {
  hour: 8,
  activityId: '2',
  activitySeconds: SECONDS_IN_HOUR * 1,
  isActive: true
}

it('shows time', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.text()).toContain(formatSeconds(timelineItem.activitySeconds))
})

it('has play button if stopwatch is active', () => {
  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
})

it('changes play button with pause button when stopwatch is started', async () => {
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)

  // await wrapper.findAll('button')[1].trigger('click')
  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)
})

it('changes pause button with play button when stopwatch is paused', async () => {
  const activeTimelineItem = { ...timelineItem, isActive: true }

  timelineItems.timelineItems.value = [activeTimelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem: activeTimelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)

  await wrapper.findAllComponents(BaseButton)[1].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
})

it('changes pause button with play button when stopwatch is reset', async () => {
  timelineItems.timelineItems.value = [activeTimelineItem]

  const wrapper = shallowMount(TimelineStopwatch, {
    props: { timelineItem: activeTimelineItem }
  })

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)

  await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
})

it('disables reset button when stopwatch is reset', async () => {
  const a: TimelineItem = {
    hour: 8,
    activityId: '2',
    activitySeconds: SECONDS_IN_HOUR * 1,
    isActive: true
  }

  timelineItems.timelineItems.value = [a]

  const wrapper = mount(TimelineStopwatch, {
    props: { timelineItem: a }
  })

  expect(wrapper.findAllComponents(BaseButton)[0].attributes()).not.toHaveProperty('disabled')

  await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

  expect(wrapper.findAllComponents(BaseButton)[0].attributes()).toHaveProperty('disabled')
})

// it.only('has play button enabled if timeline item hour is current', async () => {
//   timelineItems.timelineItems.value = [activeTimelineItem]

//   const wrapper = shallowMount(TimelineStopwatch, {
//     props: { timelineItem: activeTimelineItem }
//   })

//   expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)

//   await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

//   expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
// })

// it.only('has play button disabled if timeline item hour is not current', async () => {
//   timelineItems.timelineItems.value = [activeTimelineItem]

//   const wrapper = shallowMount(TimelineStopwatch, {
//     props: { timelineItem: activeTimelineItem }
//   })

//   expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.WARNING)

//   await wrapper.findAllComponents(BaseButton)[0].vm.$emit('click')

//   expect(wrapper.findAllComponents(BaseButton)[1].vm.type).toBe(ButtonType.SUCCESS)
// })

it('has reset button disabled if activity seconds is 0', () => {
  timelineItems.timelineItems.value = [timelineItem]

  const wrapper = mount(TimelineStopwatch, {
    props: { timelineItem }
  })

  const resetButtonWrapper = wrapper.findAllComponents(BaseButton)[0]

  expect(resetButtonWrapper.vm.type).toBe(ButtonType.DANGER)
  expect(resetButtonWrapper.attributes()).toHaveProperty('disabled')
})

it('has reset button enabled if activity seconds is > 0', () => {
  const a: TimelineItem = {
    hour: 8,
    activityId: '2',
    activitySeconds: SECONDS_IN_HOUR * 1,
    isActive: true
  }

  timelineItems.timelineItems.value = [a]

  const wrapper = mount(TimelineStopwatch, {
    props: { timelineItem: a }
  })

  const resetButtonWrapper = wrapper.findAllComponents(BaseButton)[0]

  expect(resetButtonWrapper.vm.type).toBe(ButtonType.DANGER)
  expect(resetButtonWrapper.attributes()).not.toHaveProperty('disabled')
})
