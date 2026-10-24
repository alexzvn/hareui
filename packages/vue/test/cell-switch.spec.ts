import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import type { CellSwitchProps } from '../src/components/cell-switch/CellSwitch.vue'
import CellSwitch from '../src/components/cell-switch/CellSwitch.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import Form from '../src/components/form/Form.vue'
import { expectAccessible } from './a11y'

const row = '[data-slot=switch-content]'

describe('CellSwitch', () => {
  it('renders the label inside the row, before the control', () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations' } })
    const trigger = wrapper.get(row)
    expect(trigger.attributes('role')).toBe('switch')
    expect(trigger.get('[data-slot=cell-switch-label]').text()).toBe('Animations')
    expect(trigger.find('[data-slot=switch-control]').exists()).toBe(true)
    expect(trigger.text()).toBe('Animations')
  })

  it('a click anywhere on the row toggles v-model', async () => {
    const model = ref(false)
    const wrapper = mount(
      () =>
        h(CellSwitch, {
          label: 'Animations',
          modelValue: model.value,
          'onUpdate:modelValue': (v: boolean) => (model.value = v),
        }),
      { attachTo: document.body },
    )
    await wrapper.get('[data-slot=cell-switch-label]').trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-selected')).toBe('true')
    expect(wrapper.get(row).attributes('aria-checked')).toBe('true')
    await wrapper.get(row).trigger('click')
    expect(model.value).toBe(false)
    wrapper.unmount()
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Sounds', defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.get(row).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('disabled blocks toggling and marks the root', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations', disabled: true } })
    await wrapper.get(row).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-disabled')).toBe('true')
    expect(wrapper.get(row).attributes('disabled')).toBeDefined()
  })

  it('Enter does not toggle the row, like a native switch', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations' }, attachTo: document.body })
    await wrapper.get(row).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get(row).attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('the #label slot replaces the label text and gets the checked state', async () => {
    const wrapper = mount(CellSwitch, {
      slots: { label: ({ checked }: { checked: boolean }) => (checked ? 'On' : 'Off') },
    })
    expect(wrapper.get('[data-slot=cell-switch-label]').text()).toBe('Off')
    await wrapper.get(row).trigger('click')
    expect(wrapper.get('[data-slot=cell-switch-label]').text()).toBe('On')
  })

  it('is disabled by an ancestor Fieldset', async () => {
    const wrapper = mount(Fieldset, {
      props: { disabled: true },
      slots: { default: () => h(CellSwitch, { label: 'Animations' }) },
    })
    await wrapper.get(row).trigger('click')
    expect(wrapper.get(row).attributes('disabled')).toBeDefined()
    expect(wrapper.get(row).attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-disabled')).toBe('true')
  })

  it('required inside a Form fails validation and shows the error until the row is toggled on', async () => {
    const error = () => document.querySelector('[data-slot=field-error]')?.textContent?.trim()
    const wrapper = mount(
      () =>
        h(Form, null, () =>
          h(CellSwitch, {
            label: 'Accept terms',
            name: 'terms',
            required: true,
            errorMessage: 'Accept the terms to continue',
          }),
        ),
      { attachTo: document.body },
    )
    // The hidden form input renders once the switch finds its form
    await flushPromises()
    const form = wrapper.get('form').element as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    await flushPromises()
    expect(error()).toBe('Accept the terms to continue')
    expect(wrapper.get(row).attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-invalid')).toBe('true')

    await wrapper.get(row).trigger('click')
    await flushPromises()
    expect(error()).toBeUndefined()
    expect(wrapper.get(row).attributes('aria-invalid')).toBeUndefined()
    expect(form.checkValidity()).toBe(true)
    wrapper.unmount()
  })
})

// A native button toggles on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
// the press helper performs it when the keys get through.
async function pressSpace(el: Element) {
  const down = new KeyboardEvent('keydown', {
    key: ' ',
    code: 'Space',
    bubbles: true,
    cancelable: true,
  })
  const up = new KeyboardEvent('keyup', {
    key: ' ',
    code: 'Space',
    bubbles: true,
    cancelable: true,
  })
  el.dispatchEvent(down)
  el.dispatchEvent(up)
  if (
    el instanceof HTMLButtonElement &&
    !el.disabled &&
    !down.defaultPrevented &&
    !up.defaultPrevented
  )
    el.click()
  await nextTick()
}

describe('CellSwitch accessibility', () => {
  it.each<[string, CellSwitchProps]>([
    ['off', {}],
    ['on', { defaultValue: true }],
    ['secondary', { variant: 'secondary' }],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: true }],
    ['required', { required: true }],
    ['invalid with an error message', { invalid: true, errorMessage: 'Turn animations on' }],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(CellSwitch, {
      props: { label: 'Animations', ...props },
      attachTo: document.body,
    })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations inside a form, with its hidden input', async () => {
    const wrapper = mount(
      () =>
        h('form', null, h(CellSwitch, { label: 'Animations', name: 'animations', required: true })),
      { attachTo: document.body },
    )
    await flushPromises()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by aria-label when the row has no text', async () => {
    const wrapper = mount(CellSwitch, {
      attrs: { 'aria-label': 'Animations' },
      slots: { icon: () => h('svg', { 'aria-hidden': 'true' }) },
      attachTo: document.body,
    })
    expect(wrapper.get(row).attributes('aria-label')).toBe('Animations')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('the row is a switch named by its label, with required and the error wired up', () => {
    const wrapper = mount(CellSwitch, {
      props: {
        label: 'Animations',
        required: true,
        invalid: true,
        errorMessage: 'Turn animations on',
      },
      attachTo: document.body,
    })
    const trigger = wrapper.get(row)
    expect(trigger.attributes('aria-required')).toBe('true')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    const ids = trigger.attributes('aria-describedby')!.split(' ')
    expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toEqual([
      'Turn animations on',
    ])
    wrapper.unmount()
  })

  it('the row is a single tab stop that Space toggles', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations' }, attachTo: document.body })
    const trigger = wrapper.get(row).element as HTMLButtonElement
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.tabIndex).toBe(0)
    trigger.focus()
    await pressSpace(trigger)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(trigger.getAttribute('aria-checked')).toBe('true')
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('read-only stays focusable and announced, and Space does not change it', async () => {
    const wrapper = mount(CellSwitch, {
      props: { label: 'Animations', readonly: true, defaultValue: true },
      attachTo: document.body,
    })
    const trigger = wrapper.get(row).element as HTMLButtonElement
    expect(trigger.getAttribute('aria-readonly')).toBe('true')
    trigger.focus()
    expect(document.activeElement).toBe(trigger)
    await pressSpace(trigger)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(trigger.getAttribute('aria-checked')).toBe('true')
    wrapper.unmount()
  })

  it('a disabled row is removed from the tab order', () => {
    const wrapper = mount(CellSwitch, {
      props: { label: 'Animations', disabled: true },
      attachTo: document.body,
    })
    const trigger = wrapper.get(row).element as HTMLButtonElement
    trigger.focus()
    expect(document.activeElement).not.toBe(trigger)
    wrapper.unmount()
  })
})
