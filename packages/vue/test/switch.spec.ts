import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Label from '@/components/label/Label.vue'
import type { SwitchProps } from '@/components/switch/Switch.vue'
import Switch from '@/components/switch/Switch.vue'

import { expectAccessible } from './a11y'

const control = '[data-slot=switch-content]'

describe('Switch', () => {
  it('click toggles v-model and the root selected state', async () => {
    const model = ref(false)
    const wrapper = mount(() =>
      h(Switch, {
        label: 'Wi-Fi',
        modelValue: model.value,
        'onUpdate:modelValue': (v: boolean) => (model.value = v === true),
      }),
    )

    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.find('[data-slot=switch]').attributes('data-selected')).toBe('true')
    expect(wrapper.find(control).attributes('aria-checked')).toBe('true')
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(Switch, { props: { defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
  })

  it('an external Label pointing at the id toggles the switch', async () => {
    const model = ref(false)
    const wrapper = mount(
      defineComponent(() => () => [
        h(Switch, {
          id: 'wifi',
          modelValue: model.value,
          'onUpdate:modelValue': (v: boolean) => (model.value = v === true),
        }),
        h(Label, { for: 'wifi' }, () => 'Wi-Fi'),
      ]),
      { attachTo: document.body },
    )

    await wrapper.find('label[for=wifi]').trigger('click')
    expect(model.value).toBe(true)
    wrapper.unmount()
  })

  it('#icon renders inside the thumb with the checked state', async () => {
    const wrapper = mount(Switch, {
      slots: { icon: ({ checked }: { checked: boolean }) => (checked ? 'on' : 'off') },
    })

    expect(wrapper.find('[data-slot=switch-thumb] [data-slot=switch-icon]').text()).toBe('off')
    await wrapper.find(control).trigger('click')
    expect(wrapper.find('[data-slot=switch-icon]').text()).toBe('on')
  })

  it('disabled blocks toggling', async () => {
    const wrapper = mount(Switch, { props: { disabled: true } })
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('readonly ignores toggles in uncontrolled mode and announces the state', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wifi', defaultValue: true, readonly: true } })
    const content = wrapper.find('[data-slot=switch-content]')
    await content.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-selected')).toBe('true')
    expect(content.attributes('aria-checked')).toBe('true')
    expect(content.attributes('aria-readonly')).toBe('true')
  })

  it('invalid marks the control with aria-invalid', () => {
    const wrapper = mount(Switch, { props: { label: 'Terms', invalid: true } })
    expect(wrapper.attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot=switch-content]').attributes('aria-invalid')).toBe('true')
  })
})

describe('Switch row click', () => {
  it('clicking the root outside the control toggles it', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wifi' }, attachTo: document.body })
    await wrapper.find('[data-slot=switch]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    wrapper.unmount()
  })
})

describe('Switch keyboard parity', () => {
  // behaviour-final-check S1/S2: HeroUI's switch is a native checkbox: Enter submits the form and never toggles
  it('Enter does not toggle and submits the enclosing form', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    let submitted = 0
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted++
    })

    const wrapper = mount(Switch, { props: { label: 'Wi-Fi' }, attachTo: form })
    await wrapper.get(control).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get(control).attributes('aria-checked')).toBe('false')
    expect(submitted).toBe(1)
    wrapper.unmount()
    form.remove()
  })

  it("Enter clicks the form's default button instead when it has one", async () => {
    const form = document.createElement('form')
    const submit = document.createElement('button')
    submit.type = 'submit'
    let clicked = 0
    submit.addEventListener('click', (e) => {
      e.preventDefault()
      clicked++
    })

    const host = document.createElement('div')
    form.append(host, submit)
    document.body.append(form)
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi' }, attachTo: host })
    await wrapper.get(control).trigger('keydown', { key: 'Enter' })
    expect(clicked).toBe(1)
    wrapper.unmount()
    form.remove()
  })
})

describe('Switch root click timing', () => {
  // Vue skips a later handler on an event stamped no later than the handler's attach time; a click in the same
  // millisecond as the mount must still reach the root's forwarding handler.
  it('toggles on a root click in the same millisecond as the mount', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const wrapper = mount(Switch, { props: { label: 'Wifi' }, attachTo: document.body })
    await wrapper.find('[data-slot=switch]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    wrapper.unmount()
    now.mockRestore()
  })
})

// A native button toggles on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
// the press helper performs it when the keys get through.
const pressSpace = async (el: Element) => {
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

describe('Switch accessibility', () => {
  it.each<[string, SwitchProps]>([
    ['off', {}],
    ['on', { defaultValue: true }],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: true }],
    ['required', { required: true }],
    ['small', { size: 'sm' }],
    ['described', { description: 'Connect automatically' }],
    [
      'invalid with an error message',
      { description: 'Connect automatically', invalid: true, errorMessage: 'Turn Wi-Fi on' },
    ],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi', ...props }, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations with a thumb icon', async () => {
    const wrapper = mount(Switch, {
      props: { label: 'Dark mode' },
      slots: { icon: () => h('svg', { 'aria-hidden': 'true', viewBox: '0 0 24 24' }) },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations inside a form, with its hidden input', async () => {
    const wrapper = mount(
      () => h('form', null, h(Switch, { label: 'Wi-Fi', name: 'wifi', required: true })),
      { attachTo: document.body },
    )

    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by an external Label pointing at its id', async () => {
    const wrapper = mount(
      defineComponent(
        () => () =>
          h('div', [
            h(Switch, { id: 'airplane' }),
            h(Label, { for: 'airplane' }, () => 'Airplane mode'),
          ]),
      ),
      { attachTo: document.body },
    )

    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is named by aria-label when it has no visible label', async () => {
    const wrapper = mount(Switch, { attrs: { 'aria-label': 'Dark mode' }, attachTo: document.body })
    expect(wrapper.get(control).attributes('aria-label')).toBe('Dark mode')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is a switch named by its label whose aria-checked tracks the state', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi', required: true } })
    const content = wrapper.get(control)
    expect(content.attributes('role')).toBe('switch')
    expect(content.text()).toBe('Wi-Fi')
    expect(content.attributes('aria-required')).toBe('true')
    expect(content.attributes('aria-checked')).toBe('false')
    await content.trigger('click')
    expect(content.attributes('aria-checked')).toBe('true')
    await wrapper.setProps({ modelValue: false })
    expect(content.attributes('aria-checked')).toBe('false')
  })

  it('aria-describedby points at the rendered description and error text', () => {
    const wrapper = mount(Switch, {
      props: {
        label: 'Wi-Fi',
        description: 'Connect automatically',
        errorMessage: 'Turn Wi-Fi on',
        invalid: true,
      },
      attachTo: document.body,
    })

    const ids = wrapper.get(control).attributes('aria-describedby')!.split(' ')
    expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toEqual([
      'Connect automatically',
      'Turn Wi-Fi on',
    ])

    wrapper.unmount()
  })

  it('is a tab stop that Space toggles', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wi-Fi' }, attachTo: document.body })
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

  it('a read-only switch stays focusable, keeps focus off on press, and Space does not change it', async () => {
    const wrapper = mount(Switch, {
      props: { label: 'Wi-Fi', readonly: true },
      attachTo: document.body,
    })

    const content = wrapper.get(control).element as HTMLButtonElement
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    content.dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
    content.focus()
    expect(document.activeElement).toBe(content)
    await pressSpace(content)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(content.getAttribute('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('a disabled switch is removed from the tab order', () => {
    const wrapper = mount(Switch, {
      props: { label: 'Wi-Fi', disabled: true },
      attachTo: document.body,
    })

    const content = wrapper.get(control).element as HTMLButtonElement
    expect(content.disabled).toBe(true)
    content.focus()
    expect(document.activeElement).not.toBe(content)
    wrapper.unmount()
  })
})
