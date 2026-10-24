import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import Fieldset from '@/components/fieldset/Fieldset.vue'
import ToggleButtonGroup from '@/components/toggle-button-group/ToggleButtonGroup.vue'
import ToggleButton from '@/components/toggle-button/ToggleButton.vue'

import { expectAccessible } from './a11y'

describe('ToggleButton', () => {
  it('toggles uncontrolled from defaultValue and emits the new state', async () => {
    const wrapper = mount(ToggleButton, {
      props: { defaultValue: true },
      slots: { default: () => 'Like' },
    })
    const button = wrapper.find('button')
    expect(button.attributes()).toMatchObject({ 'aria-pressed': 'true', 'data-selected': 'true' })
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(button.attributes('data-selected')).toBeUndefined()
  })

  it('stays on the controlled value until the parent updates it', async () => {
    const wrapper = mount(ToggleButton, { props: { modelValue: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
  })

  it('is disabled by an ancestor Fieldset', () => {
    const wrapper = mount(Fieldset, {
      props: { disabled: true },
      slots: { default: () => h(ToggleButton, () => 'x') },
    })
    expect(wrapper.find('[data-slot="toggle-button"]').attributes('disabled')).toBeDefined()
  })

  it.each([
    ['unpressed', {}, {}],
    ['pressed', { defaultValue: true }, {}],
    ['disabled', { disabled: true }, {}],
    ['icon-only with aria-label', { iconOnly: true, defaultValue: true }, { 'aria-label': 'Bold' }],
  ])('is accessible %s', async (_, props, attrs) => {
    const wrapper = mount(ToggleButton, {
      props,
      attrs,
      attachTo: document.body,
      slots: {
        default: () => ('aria-label' in attrs ? h('svg', { 'aria-hidden': 'true' }) : 'Bold'),
      },
    })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is a focusable native toggle that reports aria-pressed="false" until pressed', async () => {
    const wrapper = mount(ToggleButton, {
      attachTo: document.body,
      slots: { default: () => 'Bold' },
    })
    const button = wrapper.get('button').element
    expect(button.getAttribute('aria-pressed')).toBe('false')
    button.focus()
    expect(document.activeElement).toBe(button)
    // Enter / Space on a native button dispatch `click`.
    button.click()
    await nextTick()
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(document.activeElement).toBe(button)
    wrapper.unmount()
  })

  it('disabled leaves the tab order, keeps its pressed state exposed and ignores presses', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(ToggleButton, {
      props: { disabled: true, defaultValue: true, 'onUpdate:modelValue': onUpdate },
      attachTo: document.body,
      slots: { default: () => 'Bold' },
    })
    const button = wrapper.get('button').element
    button.focus()
    expect(document.activeElement).not.toBe(button)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    button.click()
    await nextTick()
    expect(onUpdate).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

const group = (props: Record<string, unknown>) =>
  mount(ToggleButtonGroup, {
    props,
    slots: { default: () => ['a', 'b', 'c'].map((v) => h(ToggleButton, { value: v }, () => v)) },
  })
const items = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot="toggle-button"]')

describe('ToggleButtonGroup', () => {
  it('single selection: radios, pressing another replaces the selection', async () => {
    const wrapper = group({ defaultValue: ['a'] })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(items(wrapper)[0]!.attributes()).toMatchObject({ role: 'radio', 'aria-checked': 'true' })
    expect(items(wrapper)[0]!.attributes('aria-pressed')).toBeUndefined()
    await items(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['b']])
    expect(items(wrapper).map((b) => b.attributes('data-selected'))).toEqual([
      undefined,
      'true',
      undefined,
    ])
  })

  it('multiple selection accumulates; disallowEmptySelection keeps the last one', async () => {
    const wrapper = group({
      selectionMode: 'multiple',
      defaultValue: ['a'],
      disallowEmptySelection: true,
    })
    expect(wrapper.attributes('role')).toBe('toolbar')
    await items(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['a', 'c']])
    await items(wrapper)[0]!.trigger('click')
    await items(wrapper)[2]!.trigger('click')
    await nextTick()
    expect(items(wrapper).map((b) => b.attributes('data-selected'))).toEqual([
      undefined,
      undefined,
      'true',
    ])
  })

  it('renders separators in every button but the first, only with `separator`, and passes group size', async () => {
    const wrapper = group({ separator: true, size: 'sm' })
    await nextTick()
    expect(items(wrapper)[0]!.find('[data-slot="toggle-button-group-separator"]').exists()).toBe(
      false,
    )
    expect(wrapper.findAll('[data-slot="toggle-button-group-separator"]')).toHaveLength(2)
    expect(items(wrapper)[0]!.classes()).toContain('px-3')
  })
})
