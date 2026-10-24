import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import CheckboxGroup from '@/components/checkbox-group/CheckboxGroup.vue'

import { expectAccessible } from './a11y'

const items = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing', disabled: true },
]

describe('CheckboxGroup', () => {
  it('toggling an item adds/removes it from v-model and updates its state', async () => {
    const model = ref<string[]>([])
    const wrapper = mount(
      () =>
        h(CheckboxGroup, {
          items,
          modelValue: model.value,
          'onUpdate:modelValue': (v: string[] | undefined) => (model.value = v ?? []),
        }),
      { attachTo: document.body },
    )
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
    const wrapper = mount(CheckboxGroup, {
      props: { items, defaultValue: ['coding'] },
      attachTo: document.body,
    })
    await wrapper.findAll('[data-slot=checkbox-content]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[data-slot=checkbox]')[2]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('labels the group and shows the error only when invalid', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { id: 'interests', items, label: 'Interests', errorMessage: 'Pick at least one' },
    })
    const root = wrapper.find('[role=group]')
    expect(root.attributes('aria-labelledby')).toBe('interests-label')
    expect(wrapper.find('#interests-label').text()).toBe('Interests')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('#interests-error').text()).toBe('Pick at least one')
    expect(root.attributes('aria-describedby')).toBe('interests-error')
  })

  it('readonly keeps the selection', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { items, readonly: true, defaultValue: ['coding'] },
      attachTo: document.body,
    })
    const boxes = wrapper.findAll('[data-slot=checkbox]')
    await boxes[0]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(boxes[0]!.attributes('data-selected')).toBe('true')
    await boxes[1]!.find('[data-slot=checkbox-content]').trigger('click')
    expect(boxes[1]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
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

describe('CheckboxGroup state parity', () => {
  // behaviour-final-check G2
  it('exposes a disabled group as aria-disabled', () => {
    const wrapper = mount(CheckboxGroup, { props: { items, disabled: true } })
    expect(wrapper.get('[data-slot=checkbox-group]').attributes('aria-disabled')).toBe('true')
    expect(
      mount(CheckboxGroup, { props: { items } })
        .get('[data-slot=checkbox-group]')
        .attributes('aria-disabled'),
    ).toBeUndefined()
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

const described = [
  { value: 'coding', label: 'Coding', description: 'Write software' },
  { value: 'design', label: 'Design', description: 'Draw interfaces' },
  { value: 'writing', label: 'Writing', disabled: true },
]

describe('CheckboxGroup accessibility', () => {
  it.each([
    ['idle', {}],
    ['with a selection', { defaultValue: ['coding'] }],
    ['described', { description: 'Pick what you enjoy' }],
    ['disabled', { disabled: true, defaultValue: ['design'] }],
    ['read-only', { readonly: true, defaultValue: ['coding'] }],
    ['required', { required: true }],
    [
      'invalid with an error message',
      { description: 'Pick what you enjoy', invalid: true, errorMessage: 'Pick at least one' },
    ],
  ])('has no axe violations when %s', async (_, props) => {
    const wrapper = mount(CheckboxGroup, {
      props: { label: 'Interests', items: described, ...props },
      attachTo: document.body,
    })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations inside a form, with its hidden inputs', async () => {
    const wrapper = mount(
      () =>
        h(
          'form',
          null,
          h(CheckboxGroup, {
            label: 'Interests',
            items,
            name: 'interests',
            defaultValue: ['coding'],
          }),
        ),
      { attachTo: document.body },
    )
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('each item is a checkbox named by its label and described by its own and the group text', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        id: 'g',
        label: 'Interests',
        description: 'Pick what you enjoy',
        items: described,
        invalid: true,
        errorMessage: 'Pick at least one',
      },
      attachTo: document.body,
    })
    const group = wrapper.get('[role=group]')
    expect(document.getElementById(group.attributes('aria-labelledby')!)?.textContent).toBe(
      'Interests',
    )
    const controls = wrapper.findAll('[data-slot=checkbox-content]')
    expect(controls.map((c) => c.attributes('role'))).toEqual(['checkbox', 'checkbox', 'checkbox'])
    expect(controls.map((c) => c.text())).toEqual(['Coding', 'Design', 'Writing'])
    const text = (ids: string | undefined) =>
      ids!.split(' ').map((id) => document.getElementById(id)?.textContent?.trim())
    expect(text(controls[0]!.attributes('aria-describedby'))).toEqual([
      'Write software',
      'Pick what you enjoy',
      'Pick at least one',
    ])
    expect(text(controls[2]!.attributes('aria-describedby'))).toEqual([
      'Pick what you enjoy',
      'Pick at least one',
    ])
    expect(controls.every((c) => c.attributes('aria-invalid') === 'true')).toBe(true)
    wrapper.unmount()
  })

  it('aria-checked reflects the selection; disabled items are exposed as disabled', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { items, defaultValue: ['design'] },
      attachTo: document.body,
    })
    const controls = wrapper.findAll('[data-slot=checkbox-content]')
    expect(controls.map((c) => c.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(controls.map((c) => (c.element as HTMLButtonElement).disabled)).toEqual([
      false,
      false,
      true,
    ])
    wrapper.unmount()
  })

  it('a read-only group announces read-only on every item', () => {
    const wrapper = mount(CheckboxGroup, { props: { items, readonly: true } })
    expect(
      wrapper.findAll('[data-slot=checkbox-content]').map((c) => c.attributes('aria-readonly')),
    ).toEqual(['true', 'true', 'true'])
  })

  it('every enabled item is its own tab stop and Space toggles the focused one', async () => {
    const model = ref<string[]>([])
    const wrapper = mount(
      () =>
        h(CheckboxGroup, {
          items,
          modelValue: model.value,
          'onUpdate:modelValue': (v: string[] | undefined) => (model.value = v ?? []),
        }),
      { attachTo: document.body },
    )
    const controls = wrapper
      .findAll('[data-slot=checkbox-content]')
      .map((c) => c.element as HTMLButtonElement)
    expect(controls.map((c) => c.tabIndex)).toEqual([0, 0, 0])
    expect(controls[2]!.disabled).toBe(true)
    controls[1]!.focus()
    await pressSpace(controls[1]!)
    expect(model.value).toEqual(['design'])
    expect(controls[1]!.getAttribute('aria-checked')).toBe('true')
    await pressSpace(controls[1]!)
    expect(model.value).toEqual([])
    expect(document.activeElement).toBe(controls[1])
    wrapper.unmount()
  })

  it('arrow keys do not move focus between items (no roving focus)', async () => {
    const wrapper = mount(CheckboxGroup, { props: { items }, attachTo: document.body })
    const first = wrapper.findAll('[data-slot=checkbox-content]')[0]!
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'ArrowDown' })
    await new Promise((resolve) => setTimeout(resolve))
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('Space on a read-only group keeps the selection', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { items, readonly: true, defaultValue: ['coding'] },
      attachTo: document.body,
    })
    const controls = wrapper
      .findAll('[data-slot=checkbox-content]')
      .map((c) => c.element as HTMLButtonElement)
    controls[1]!.focus()
    expect(document.activeElement).toBe(controls[1])
    await pressSpace(controls[1]!)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(controls.map((c) => c.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false'])
    wrapper.unmount()
  })
})
