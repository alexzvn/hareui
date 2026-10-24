import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'

import type { RadioGroupProps } from '@/components/radio-group/RadioGroup.types'
import RadioGroup from '@/components/radio-group/RadioGroup.vue'

import { expectAccessible } from './a11y'

const items = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'business', label: 'Business', disabled: true },
]

describe('RadioGroup', () => {
  it('selecting an item updates v-model and the item state', async () => {
    const model = ref<string>()
    const wrapper = mount(
      () =>
        h(RadioGroup, {
          items,
          modelValue: model.value,
          'onUpdate:modelValue': (v: string | undefined) => (model.value = v),
        }),
      { attachTo: document.body },
    )

    const radios = wrapper.findAll('[data-slot=radio]')
    await radios[1]!.find('[data-slot=radio-content]').trigger('click')
    expect(model.value).toBe('premium')
    expect(radios[1]!.attributes('data-selected')).toBe('true')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('a disabled item cannot be selected', async () => {
    const wrapper = mount(RadioGroup, {
      props: { items, defaultValue: 'basic' },
      attachTo: document.body,
    })

    await wrapper.findAll('[data-slot=radio-content]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[data-slot=radio]')[0]!.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('labels the group and shows the error only when invalid', async () => {
    const wrapper = mount(RadioGroup, {
      props: { id: 'plan', items, label: 'Plan', errorMessage: 'Pick one' },
    })

    const root = wrapper.find('[role=radiogroup]')
    expect(root.attributes('aria-labelledby')).toBe('plan-label')
    expect(wrapper.find('#plan-label').text()).toBe('Plan')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('#plan-error').text()).toBe('Pick one')
    expect(root.attributes('aria-describedby')).toBe('plan-error')
  })

  it('readonly keeps the selection, also when nothing is selected yet', async () => {
    const wrapper = mount(RadioGroup, { props: { items, readonly: true }, attachTo: document.body })
    const radios = wrapper.findAll('[data-slot=radio]')
    await radios[0]!.find('[data-slot=radio-content]').trigger('click')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.find('[data-slot=radio-content][data-state=checked]').exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.setProps({ defaultValue: 'premium' })
    await radios[0]!.find('[data-slot=radio-content]').trigger('click')
    expect(radios[1]!.attributes('data-selected')).toBe('true')
    expect(radios[1]!.find('[data-slot=radio-content]').attributes('data-selected')).toBe('true')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.find('[data-slot=radio-group]').attributes('aria-readonly')).toBe('true')
    wrapper.unmount()
  })
})

describe('RadioGroup row click', () => {
  it('clicking the empty space of an item row selects it', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      },
      attachTo: document.body,
    })

    await wrapper.findAll('[data-slot=radio]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    wrapper.unmount()
  })
})

describe('RadioGroup keyboard and state parity', () => {
  // behaviour-final-check R2: RAC ignores Home / End / PageUp / PageDown in a radio group
  it('Home / End / PageUp / PageDown neither move focus nor change the selection', async () => {
    const wrapper = mount(RadioGroup, {
      props: { items, defaultValue: 'premium' },
      attachTo: document.body,
    })

    const radios = wrapper.findAll('[data-slot=radio-content]')
    ;(radios[1]!.element as HTMLElement).focus()

    for (const key of ['Home', 'End', 'PageUp', 'PageDown']) {
      await radios[1]!.trigger('keydown', { key })
      await new Promise((resolve) => setTimeout(resolve))
      expect(document.activeElement).toBe(radios[1]!.element)
    }

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  // behaviour-final-check R5
  it('exposes a disabled group as aria-disabled', () => {
    const wrapper = mount(RadioGroup, { props: { items, disabled: true } })
    expect(wrapper.get('[data-slot=radio-group]').attributes('aria-disabled')).toBe('true')

    expect(
      mount(RadioGroup, { props: { items } })
        .get('[data-slot=radio-group]')
        .attributes('aria-disabled'),
    ).toBeUndefined()
  })

  // behaviour-final-check R4
  it('Enter on a radio submits the enclosing form without selecting it', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    let submitted = 0
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted++
    })

    const wrapper = mount(RadioGroup, { props: { items }, attachTo: form })
    await wrapper.findAll('[data-slot=radio-content]')[0]!.trigger('keydown', { key: 'Enter' })
    expect(submitted).toBe(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
    form.remove()
  })
})

// A native button activates on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
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

  await flushPromises()
}

// Real key timing: Reka flags arrow keys on window keydown (cleared on keyup), its roving group moves focus on the
// next tick, and the newly focused radio clicks itself in a timeout while the flag is still set.
const pressArrow = async (key: string) => {
  const radio = document.activeElement as HTMLElement
  radio.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve))
  await flushPromises()
  radio.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  await flushPromises()
}

const described = [
  { value: 'basic', label: 'Basic', description: 'For one person' },
  { value: 'premium', label: 'Premium', description: 'For a team' },
  { value: 'business', label: 'Business', disabled: true },
]

describe('RadioGroup accessibility', () => {
  it.each<[string, RadioGroupProps]>([
    ['idle', {}],
    ['with a selection', { defaultValue: 'premium' }],
    ['described', { description: 'Billed monthly' }],
    ['horizontal', { orientation: 'horizontal' }],
    ['disabled', { disabled: true, defaultValue: 'basic' }],
    ['read-only', { readonly: true, defaultValue: 'basic' }],
    ['required', { required: true }],
    [
      'invalid with an error message',
      { description: 'Billed monthly', invalid: true, errorMessage: 'Pick a plan' },
    ],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(RadioGroup, {
      props: { label: 'Plan', items: described, ...props },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations inside a form, with its hidden input', async () => {
    const wrapper = mount(
      () =>
        h(
          'form',
          null,
          h(RadioGroup, {
            label: 'Plan',
            items,
            name: 'plan',
            required: true,
            defaultValue: 'basic',
          }),
        ),
      { attachTo: document.body },
    )

    await flushPromises()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('radios are named by their labels and described by their own and the group text', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        id: 'p',
        label: 'Plan',
        description: 'Billed monthly',
        items: described,
        invalid: true,
        errorMessage: 'Pick a plan',
      },
      attachTo: document.body,
    })

    const group = wrapper.get('[role=radiogroup]')
    expect(document.getElementById(group.attributes('aria-labelledby')!)?.textContent).toBe('Plan')
    expect(group.attributes('aria-invalid')).toBe('true')
    const radios = wrapper.findAll('[data-slot=radio-content]')
    expect(radios.map((r) => r.attributes('role'))).toEqual(['radio', 'radio', 'radio'])
    expect(radios.map((r) => r.text())).toEqual(['Basic', 'Premium', 'Business'])

    const text = (ids: string | undefined) =>
      ids!.split(' ').map((id) => document.getElementById(id)?.textContent?.trim())

    expect(text(radios[0]!.attributes('aria-describedby'))).toEqual([
      'For one person',
      'Billed monthly',
      'Pick a plan',
    ])

    expect(text(radios[2]!.attributes('aria-describedby'))).toEqual([
      'Billed monthly',
      'Pick a plan',
    ])

    expect(wrapper.get('[data-slot=radio-indicator]').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('exposes required, orientation and per-radio checked / disabled state', async () => {
    const wrapper = mount(RadioGroup, {
      props: { items, required: true, orientation: 'horizontal', defaultValue: 'premium' },
    })

    const group = wrapper.get('[role=radiogroup]')
    expect(group.attributes('aria-required')).toBe('true')
    expect(group.attributes('aria-orientation')).toBe('horizontal')
    const radios = wrapper.findAll('[data-slot=radio-content]')
    expect(radios.map((r) => r.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])

    expect(radios.map((r) => (r.element as HTMLButtonElement).disabled)).toEqual([
      false,
      false,
      true,
    ])
  })

  // Reka's roving group is itself the tab stop and hands focus to the right radio on entry
  it('Tab enters the group on the selected radio, else on the first enabled one', async () => {
    const selected = mount(RadioGroup, {
      props: { items, defaultValue: 'premium' },
      attachTo: document.body,
    })

    await flushPromises()
    const group = selected.get('[role=radiogroup]').element as HTMLElement
    const radios = selected.findAll('[data-slot=radio-content]').map((r) => r.element)
    expect(group.tabIndex).toBe(0)
    expect(radios.map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '-1', '-1'])
    group.focus()
    await flushPromises()
    expect(document.activeElement).toBe(radios[1])
    expect(radios.map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '0', '-1'])
    selected.unmount()

    const firstDisabled = [
      { value: 'closed', label: 'Closed', disabled: true },
      ...items.slice(0, 2),
    ]

    const empty = mount(RadioGroup, { props: { items: firstDisabled }, attachTo: document.body })
    await flushPromises()
    ;(empty.get('[role=radiogroup]').element as HTMLElement).focus()
    await flushPromises()
    expect(document.activeElement).toBe(empty.findAll('[data-slot=radio-content]')[1]!.element)
    empty.unmount()
  })

  it('arrow keys move focus and selection together, skipping disabled radios and wrapping', async () => {
    const model = ref('basic')
    const wrapper = mount(
      () =>
        h(RadioGroup, {
          items,
          modelValue: model.value,
          'onUpdate:modelValue': (v: string | undefined) => (model.value = v!),
        }),
      { attachTo: document.body },
    )

    await flushPromises()
    const radios = wrapper.findAll('[data-slot=radio-content]').map((r) => r.element)
    ;(radios[0] as HTMLElement).focus()
    await pressArrow('ArrowDown')
    expect(document.activeElement).toBe(radios[1])
    expect(model.value).toBe('premium')
    await pressArrow('ArrowDown')
    expect(document.activeElement).toBe(radios[0])
    expect(model.value).toBe('basic')
    await pressArrow('ArrowUp')
    expect(document.activeElement).toBe(radios[1])
    expect(model.value).toBe('premium')
    expect(radios[1]!.getAttribute('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('Space selects the focused radio when nothing is selected', async () => {
    const wrapper = mount(RadioGroup, { props: { items }, attachTo: document.body })
    await flushPromises()
    const first = wrapper.findAll('[data-slot=radio-content]')[0]!.element as HTMLButtonElement
    first.focus()
    await pressSpace(first)
    expect(wrapper.emitted('update:modelValue')).toEqual([['basic']])
    expect(first.getAttribute('aria-checked')).toBe('true')
    expect(document.activeElement).toBe(first)
    wrapper.unmount()
  })

  it('in a read-only group arrow keys move focus without changing the selection', async () => {
    const wrapper = mount(RadioGroup, {
      props: { items, readonly: true, defaultValue: 'basic' },
      attachTo: document.body,
    })

    await flushPromises()
    const radios = wrapper.findAll('[data-slot=radio-content]').map((r) => r.element)
    ;(radios[0] as HTMLElement).focus()
    await pressArrow('ArrowDown')
    expect(document.activeElement).toBe(radios[1])
    await pressSpace(radios[1]!)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false'])
    wrapper.unmount()
  })

  it('a disabled group takes no focus', () => {
    const wrapper = mount(RadioGroup, { props: { items, disabled: true }, attachTo: document.body })
    const radios = wrapper
      .findAll('[data-slot=radio-content]')
      .map((r) => r.element as HTMLButtonElement)

    expect(radios.every((r) => r.disabled)).toBe(true)
    radios[0]!.focus()
    expect(document.activeElement).not.toBe(radios[0])
    wrapper.unmount()
  })
})
