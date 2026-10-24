import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { ProgressBarProps } from '@/components/progress-bar/ProgressBar.vue'
import ProgressBar from '@/components/progress-bar/ProgressBar.vue'

import { expectAccessible } from './a11y'

const slots = (wrapper: ReturnType<typeof mount>) => {
  return wrapper.findAll('[data-slot]').map((el) => el.attributes('data-slot'))
}

describe('ProgressBar', () => {
  it('exposes React Aria progressbar semantics and labels itself with the visible label', () => {
    const wrapper = mount(ProgressBar, { props: { label: 'Loading', value: 60 } })
    const root = wrapper.get('[role="progressbar"]')
    expect(root.attributes()).toMatchObject({
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '60',
      'aria-valuetext': '60%',
    })

    expect(root.attributes('aria-label')).toBeUndefined()

    expect(root.attributes('aria-labelledby')).toBe(
      wrapper.get('[data-slot="label"]').attributes('id'),
    )

    expect(wrapper.get('[data-slot="progress-bar-output"]').text()).toBe('60%')

    expect(wrapper.get('[data-slot="progress-bar-fill"]').attributes('style')).toContain(
      'width: 60%',
    )
  })

  it('maps value onto a custom range and formats with formatOptions', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        label: 'Revenue',
        value: 750,
        minValue: 500,
        maxValue: 1000,
        formatOptions: { style: 'currency', currency: 'USD' },
      },
    })

    const root = wrapper.get('[role="progressbar"]')
    expect(root.attributes()).toMatchObject({
      'aria-valuemin': '500',
      'aria-valuemax': '1000',
      'aria-valuenow': '750',
      'aria-valuetext': '$750.00',
    })

    expect(wrapper.get('[data-slot="progress-bar-fill"]').attributes('style')).toContain(
      'width: 50%',
    )
  })

  it('clamps out-of-range values', () => {
    const wrapper = mount(ProgressBar, { props: { label: 'Over', value: 150 } })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('[data-slot="progress-bar-output"]').text()).toBe('100%')
  })

  it('valueLabel replaces the formatted value', () => {
    const wrapper = mount(ProgressBar, {
      props: { label: 'Steps', value: 3, maxValue: 4, valueLabel: '3 of 4' },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuetext')).toBe('3 of 4')
    expect(wrapper.get('[data-slot="progress-bar-output"]').text()).toBe('3 of 4')
  })

  it('indeterminate drops the value, the output and the fill width', () => {
    const wrapper = mount(ProgressBar, { props: { label: 'Loading...', indeterminate: true } })
    const root = wrapper.get('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.attributes('aria-valuetext')).toBeUndefined()

    expect(slots(wrapper)).toEqual([
      'progress-bar',
      'label',
      'progress-bar-track',
      'progress-bar-fill',
    ])

    expect(wrapper.get('[data-slot="progress-bar-fill"]').attributes('style')).toBeUndefined()
  })

  it('renders the output next to a label by default; showOutput overrides', () => {
    expect(slots(mount(ProgressBar, { props: { value: 10 } }))).toEqual([
      'progress-bar',
      'progress-bar-track',
      'progress-bar-fill',
    ])

    expect(slots(mount(ProgressBar, { props: { value: 10, showOutput: true } }))).toContain(
      'progress-bar-output',
    )

    expect(
      slots(mount(ProgressBar, { props: { label: 'L', value: 10, showOutput: false } })),
    ).not.toContain('progress-bar-output')
  })

  it('#output receives the progress state', () => {
    const wrapper = mount(ProgressBar, {
      props: { label: 'L', value: 25 },
      slots: {
        output: `<template #output="{ percentage, valueText }">{{ percentage }}|{{ valueText }}</template>`,
      },
    })

    expect(wrapper.get('[data-slot="progress-bar-output"]').text()).toBe('25|25%')
  })

  it.each<[string, ProgressBarProps & { 'aria-label'?: string }]>([
    ['with a visible label', { label: 'Uploading', value: 60 }],
    ['named by aria-label only', { 'aria-label': 'Uploading', value: 60 }],
    ['indeterminate', { label: 'Loading', indeterminate: true }],
    ['with a custom value label', { label: 'Steps', value: 3, maxValue: 4, valueLabel: '3 of 4' }],
  ])('has no axe violations: %s', async (_, props) => {
    const wrapper = mount(ProgressBar, { props, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('aria-label names the progress bar itself and it is not focusable', () => {
    const wrapper = mount(ProgressBar, { props: { 'aria-label': 'Uploading', value: 10 } })
    const root = wrapper.get('[role="progressbar"]')
    expect(root.attributes('aria-label')).toBe('Uploading')
    expect(root.attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
  })

  it('state attributes follow the value and switching to indeterminate', async () => {
    const wrapper = mount(ProgressBar, { props: { label: 'Uploading', value: 20 } })
    const root = wrapper.get('[role="progressbar"]')
    await wrapper.setProps({ value: 80 })
    expect(root.attributes()).toMatchObject({ 'aria-valuenow': '80', 'aria-valuetext': '80%' })
    await wrapper.setProps({ indeterminate: true })
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.attributes('aria-valuetext')).toBeUndefined()

    expect(root.attributes('aria-labelledby')).toBe(
      wrapper.get('[data-slot="label"]').attributes('id'),
    )
  })
})
