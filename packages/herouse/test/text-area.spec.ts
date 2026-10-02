import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import TextArea from '../src/components/TextArea.vue'
import TextField from '../src/components/TextField.vue'

describe('TextArea', () => {
  it('renders a textarea with HeroUI data-slot and forwards native attributes', () => {
    const wrapper = mount(TextArea, { attrs: { 'rows': 6, 'aria-label': 'Notes' } })
    const el = wrapper.get('textarea')
    expect(el.attributes('data-slot')).toBe('textarea')
    expect(el.attributes('rows')).toBe('6')
    expect(el.attributes('aria-label')).toBe('Notes')
  })

  it('supports v-model and defaultValue', async () => {
    const wrapper = mount(TextArea, { props: { defaultValue: 'seed' } })
    const el = wrapper.get('textarea')
    expect(el.element.value).toBe('seed')
    await el.setValue('typed')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['typed'])
  })

  it('inside a TextField takes the field id, description, variant and value', async () => {
    const wrapper = mount(TextField, {
      props: { label: 'Message', description: 'Max 500', variant: 'secondary', defaultValue: 'hi' },
      slots: { default: () => h(TextArea) },
    })
    const el = wrapper.get('textarea')
    expect(wrapper.get('label').attributes('for')).toBe(el.attributes('id'))
    expect(el.attributes('aria-describedby')).toBe(wrapper.get('[data-slot="description"]').attributes('id'))
    expect(el.classes()).toContain('bg-(--textarea-bg)')
    expect(el.element.value).toBe('hi')
  })

  it('marks itself invalid when a bare TextArea fails validate', async () => {
    const wrapper = mount(TextArea, { props: { validate: (v: string | number) => (String(v).length > 3 ? 'Too long' : true), validationBehavior: 'aria' } })
    await wrapper.get('textarea').setValue('too long')
    await wrapper.get('textarea').trigger('blur')
    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true')
  })
})
