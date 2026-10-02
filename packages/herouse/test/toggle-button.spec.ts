import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Fieldset from '../src/components/Fieldset.vue'
import ToggleButton from '../src/components/ToggleButton.vue'
import ToggleButtonGroup from '../src/components/ToggleButtonGroup.vue'

describe('ToggleButton', () => {
  it('toggles uncontrolled from defaultValue and emits the new state', async () => {
    const wrapper = mount(ToggleButton, { props: { defaultValue: true }, slots: { default: () => 'Like' } })
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
    const wrapper = mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(ToggleButton, () => 'x') } })
    expect(wrapper.find('[data-slot="toggle-button"]').attributes('disabled')).toBeDefined()
  })
})

const group = (props: Record<string, unknown>) => mount(ToggleButtonGroup, {
  props,
  slots: { default: () => ['a', 'b', 'c'].map(v => h(ToggleButton, { value: v }, () => v)) },
})
const items = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot="toggle-button"]')

describe('ToggleButtonGroup', () => {
  it('single selection: radios, pressing another replaces the selection', async () => {
    const wrapper = group({ defaultValue: ['a'] })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(items(wrapper)[0]!.attributes()).toMatchObject({ 'role': 'radio', 'aria-checked': 'true' })
    expect(items(wrapper)[0]!.attributes('aria-pressed')).toBeUndefined()
    await items(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['b']])
    expect(items(wrapper).map(b => b.attributes('data-selected'))).toEqual([undefined, 'true', undefined])
  })

  it('multiple selection accumulates; disallowEmptySelection keeps the last one', async () => {
    const wrapper = group({ selectionMode: 'multiple', defaultValue: ['a'], disallowEmptySelection: true })
    expect(wrapper.attributes('role')).toBe('toolbar')
    await items(wrapper)[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['a', 'c']])
    await items(wrapper)[0]!.trigger('click')
    await items(wrapper)[2]!.trigger('click')
    await nextTick()
    expect(items(wrapper).map(b => b.attributes('data-selected'))).toEqual([undefined, undefined, 'true'])
  })

  it('renders separators in every button but the first, only with `separator`, and passes group size', async () => {
    const wrapper = group({ separator: true, size: 'sm' })
    await nextTick()
    expect(items(wrapper)[0]!.find('[data-slot="toggle-button-group-separator"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-slot="toggle-button-group-separator"]')).toHaveLength(2)
    expect(items(wrapper)[0]!.classes()).toContain('px-3')
  })
})
