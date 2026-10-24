import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import type { CheckboxProps } from '../src/components/checkbox/Checkbox.vue'
import Checkbox from '../src/components/checkbox/Checkbox.vue'
import Label from '../src/components/label/Label.vue'
import { expectAccessible } from './a11y'

const control = '[data-slot=checkbox-content]'

describe('Checkbox', () => {
  it('click toggles v-model and the root selected state', async () => {
    const model = ref<boolean | 'indeterminate'>(false)
    const wrapper = mount(() => h(Checkbox, { 'label': 'Terms', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => (model.value = v) }))
    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.find('[data-slot=checkbox]').attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(false)
    expect(wrapper.find('[data-slot=checkbox]').attributes('data-selected')).toBeUndefined()
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(Checkbox, { props: { defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
  })

  it('\'indeterminate\' renders the dash indicator and resolves to checked on click', async () => {
    const wrapper = mount(Checkbox, { props: { 'modelValue': 'indeterminate' as const, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => wrapper.setProps({ modelValue: v }) } })
    expect(wrapper.find('[data-slot=checkbox-default-indicator--indeterminate]').exists()).toBe(true)
    expect(wrapper.find(control).attributes('aria-checked')).toBe('mixed')
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.find('[data-slot=checkbox-default-indicator--checkmark]').exists()).toBe(true)
  })

  it('an external Label pointing at the id toggles the checkbox', async () => {
    const model = ref(false)
    const wrapper = mount(defineComponent(() => () => [
      h(Checkbox, { 'id': 'marketing', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => (model.value = v === true) }),
      h(Label, { for: 'marketing' }, () => 'Send me marketing emails'),
    ]), { attachTo: document.body })
    await wrapper.find('label[for=marketing]').trigger('click')
    expect(model.value).toBe(true)
    wrapper.unmount()
  })

  it('disabled blocks toggling', async () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-disabled')).toBe('true')
  })

  it('shows errorMessage only when invalid and wires aria-describedby', async () => {
    const wrapper = mount(Checkbox, { props: { id: 'c', description: 'Help', errorMessage: 'Required' } })
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    expect(wrapper.find(control).attributes('aria-describedby')).toBe('c-description')
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('[data-slot=field-error]').text()).toBe('Required')
    expect(wrapper.find(control).attributes('aria-describedby')).toBe('c-description c-error')
    expect(wrapper.find(control).attributes('aria-invalid')).toBe('true')
  })

  it('readonly ignores toggles in uncontrolled mode', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', readonly: true } })
    const content = wrapper.find('[data-slot=checkbox-content]')
    await content.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-selected')).toBeUndefined()
    expect(content.attributes('aria-checked')).toBe('false')
    expect(content.attributes('aria-readonly')).toBe('true')
  })
})

describe('Checkbox row click', () => {
  it('clicking the root outside the control toggles it, but nested links are left alone', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept' }, slots: { description: () => h('a', { href: '#x' }, 'terms') }, attachTo: document.body })
    await wrapper.find('[data-slot=checkbox]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    wrapper.unmount()
  })
})

describe('Checkbox indeterminate glyph click', () => {
  // behaviour-final-check H4
  // A script-dispatched click never reaches the microtask checkpoint a user click gets between listeners, so
  // re-render right after the control's own handler: that detaches the glyph before the root's bubbling handler runs.
  it('toggles once when the glyph is clicked (uncontrolled)', async () => {
    const wrapper = mount(Checkbox, { props: { defaultValue: 'indeterminate' }, attachTo: document.body })
    wrapper.find(control).element.addEventListener('click', () => wrapper.vm.$.update())
    await wrapper.find('[data-slot=checkbox-default-indicator--indeterminate]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('toggles once when the glyph is clicked (v-model)', async () => {
    const model = ref<boolean | 'indeterminate'>('indeterminate')
    const seen: Array<boolean | 'indeterminate'> = []
    const wrapper = mount(() => h(Checkbox, { 'label': 'All', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => { seen.push(v); model.value = v } }), { attachTo: document.body })
    wrapper.find(control).element.addEventListener('click', () => wrapper.vm.$.update())
    await wrapper.find('[data-slot=checkbox-default-indicator--indeterminate]').trigger('click')
    expect(seen).toEqual([true])
    expect(model.value).toBe(true)
    wrapper.unmount()
  })
})

describe('Checkbox keyboard and readonly parity', () => {
  // behaviour-final-check C3: a native checkbox performs the form's implicit submission on Enter
  it('Enter submits the enclosing form and does not toggle', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    let submitted = 0
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted++
    })
    const wrapper = mount(Checkbox, { props: { label: 'Terms' }, attachTo: form })
    await wrapper.get(control).trigger('keydown', { key: 'Enter' })
    expect(submitted).toBe(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
    form.remove()
  })

  // behaviour-final-check C4: RAC ignores presses on a readonly checkbox, so focus stays where it was
  it('pressing a readonly checkbox does not take focus', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', readonly: true }, attachTo: document.body })
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    wrapper.get(control).element.dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
    const editable = mount(Checkbox, { props: { label: 'Terms' }, attachTo: document.body })
    const editableDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    editable.get(control).element.dispatchEvent(editableDown)
    expect(editableDown.defaultPrevented).toBe(false)
    wrapper.unmount()
    editable.unmount()
  })
})

describe('Checkbox root click timing', () => {
  // Vue skips a later handler on an event stamped no later than the handler's attach time; a click in the same
  // millisecond as the mount must still reach the root's forwarding handler.
  it('toggles on a root click in the same millisecond as the mount', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Checkbox, { props: { label: 'Terms' }, attachTo: document.body })
    await wrapper.find('[data-slot=checkbox]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    wrapper.unmount()
    now.mockRestore()
  })
})

// A native button toggles on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
// the press helper performs it when the keys get through.
async function pressSpace(el: Element) {
  const down = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true })
  const up = new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true, cancelable: true })
  el.dispatchEvent(down)
  el.dispatchEvent(up)
  if (el instanceof HTMLButtonElement && !el.disabled && !down.defaultPrevented && !up.defaultPrevented)
    el.click()
  await nextTick()
}

describe('Checkbox accessibility', () => {
  it.each<[string, CheckboxProps]>([
    ['unchecked', {}],
    ['checked', { defaultValue: true }],
    ['indeterminate', { defaultValue: 'indeterminate' }],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: true }],
    ['required', { required: true }],
    ['described', { description: 'We only send product news' }],
    ['invalid with an error message', { description: 'Required to continue', invalid: true, errorMessage: 'Accept the terms' }],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept terms', ...props }, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations inside a form, with its hidden input', async () => {
    const wrapper = mount(() => h('form', null, h(Checkbox, { label: 'Accept terms', name: 'terms', required: true })), { attachTo: document.body })
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by an external Label pointing at its id', async () => {
    const wrapper = mount(defineComponent(() => () => h('div', [
      h(Checkbox, { id: 'news' }),
      h(Label, { for: 'news' }, () => 'Send me news'),
    ])), { attachTo: document.body })
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by aria-label when it has no visible label', async () => {
    const wrapper = mount(Checkbox, { attrs: { 'aria-label': 'Select row' }, attachTo: document.body })
    expect(wrapper.get(control).attributes('aria-label')).toBe('Select row')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by its label text', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept terms' } })
    expect(wrapper.get(control).attributes('role')).toBe('checkbox')
    expect(wrapper.get(control).text()).toBe('Accept terms')
    expect(wrapper.get('[data-slot=checkbox-indicator]').attributes('aria-hidden')).toBe('true')
  })

  it('aria-checked tracks the state, and required is announced', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'All', required: true } })
    const content = wrapper.get(control)
    expect(content.attributes('aria-checked')).toBe('false')
    expect(content.attributes('aria-required')).toBe('true')
    await content.trigger('click')
    expect(content.attributes('aria-checked')).toBe('true')
    await wrapper.setProps({ modelValue: 'indeterminate' })
    expect(content.attributes('aria-checked')).toBe('mixed')
  })

  it('aria-describedby points at the rendered description and error text', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', description: 'Read them first', errorMessage: 'Accept the terms', invalid: true }, attachTo: document.body })
    const ids = wrapper.get(control).attributes('aria-describedby')!.split(' ')
    expect(ids.map(id => document.getElementById(id)?.textContent?.trim())).toEqual(['Read them first', 'Accept the terms'])
    wrapper.unmount()
  })

  it('is a single tab stop that Space toggles', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms' }, attachTo: document.body })
    const content = wrapper.get(control).element as HTMLButtonElement
    expect(content.tagName).toBe('BUTTON')
    expect(content.tabIndex).toBe(0)
    content.focus()
    await pressSpace(content)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(content.getAttribute('aria-checked')).toBe('true')
    await pressSpace(content)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
    expect(document.activeElement).toBe(content)
    wrapper.unmount()
  })

  it('a read-only checkbox stays focusable but Space does not change it', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', readonly: true }, attachTo: document.body })
    const content = wrapper.get(control).element as HTMLButtonElement
    expect(content.disabled).toBe(false)
    content.focus()
    expect(document.activeElement).toBe(content)
    await pressSpace(content)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(content.getAttribute('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('a disabled checkbox is removed from the tab order', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', disabled: true }, attachTo: document.body })
    const content = wrapper.get(control).element as HTMLButtonElement
    expect(content.disabled).toBe(true)
    content.focus()
    expect(document.activeElement).not.toBe(content)
    wrapper.unmount()
  })
})
