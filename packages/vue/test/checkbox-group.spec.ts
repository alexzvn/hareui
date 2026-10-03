import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import CheckboxGroup from '../src/components/checkbox-group/CheckboxGroup.vue'

const items = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing', disabled: true },
]

describe('CheckboxGroup', () => {
  it('toggling an item adds/removes it from v-model and updates its state', async () => {
    const model = ref<string[]>([])
    const wrapper = mount(() => h(CheckboxGroup, { items, 'modelValue': model.value, 'onUpdate:modelValue': (v: string[] | undefined) => (model.value = v ?? []) }), { attachTo: document.body })
    const boxes = wrapper.findAll('[data-slot=checkbox]')
    await boxes[1]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(model.value).toEqual(['design'])
    expect(boxes[1]!.attributes('data-selected')).toBe('true')
    expect(boxes[0]!.attributes('data-selected')).toBeUndefined()

    await wrapper.setProps({ modelValue: model.value })
    await boxes[1]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(model.value).toEqual([])
    expect(boxes[1]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('a disabled item cannot be toggled', async () => {
    const wrapper = mount(CheckboxGroup, { props: { items, defaultValue: ['coding'] }, attachTo: document.body })
    await wrapper.findAll('[data-slot=checkbox-content]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[data-slot=checkbox]')[2]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('labels the group and shows the error only when invalid', async () => {
    const wrapper = mount(CheckboxGroup, { props: { id: 'interests', items, label: 'Interests', errorMessage: 'Pick at least one' } })
    const root = wrapper.find('[role=group]')
    expect(root.attributes('aria-labelledby')).toBe('interests-label')
    expect(wrapper.find('#interests-label').text()).toBe('Interests')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('#interests-error').text()).toBe('Pick at least one')
    expect(root.attributes('aria-describedby')).toBe('interests-error')
  })

  it('readonly keeps the selection', async () => {
    const wrapper = mount(CheckboxGroup, { props: { items, readonly: true, defaultValue: ['coding'] }, attachTo: document.body })
    const boxes = wrapper.findAll('[data-slot=checkbox]')
    await boxes[0]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(boxes[0]!.attributes('data-selected')).toBe('true')
    await boxes[1]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(boxes[1]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('[data-slot=checkbox-group]').attributes('aria-readonly')).toBe('true')
    wrapper.unmount()
  })

  it('group disabled propagates to every item', () => {
    const wrapper = mount(CheckboxGroup, { props: { items, disabled: true } })
    const content = wrapper.findAll('[data-slot=checkbox-content]')
    expect(content[0]!.attributes('data-disabled')).toBe('')
    expect(wrapper.findAll('[data-slot=checkbox]')[0]!.attributes('data-disabled')).toBe('true')
  })
})

describe('CheckboxGroup row click', () => {
  it('clicking the empty space of an item row toggles it', async () => {
    const wrapper = mount(CheckboxGroup, { props: { items }, attachTo: document.body })
    const boxes = wrapper.findAll('[data-slot=checkbox]')
    await boxes[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['coding']])
    // A disabled item ignores row clicks too
    await boxes[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    wrapper.unmount()
  })
})
