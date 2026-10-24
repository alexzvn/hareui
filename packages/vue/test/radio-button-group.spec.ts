import type { RadioButtonGroupItemSlotProps } from '../src/components/radio-button-group/RadioButtonGroupItem.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import Form from '../src/components/form/Form.vue'
import RadioButtonGroup from '../src/components/radio-button-group/RadioButtonGroup.vue'
import RadioButtonGroupItem from '../src/components/radio-button-group/RadioButtonGroupItem.vue'
import { expectAccessible } from './a11y'

const plans = [
  { value: 'starter', label: 'Starter', description: 'For individuals' },
  { value: 'pro', label: 'Pro', description: 'For teams' },
  { value: 'enterprise', label: 'Enterprise', description: 'For organizations', disabled: true },
]

// `props` may be a getter so reactive values (v-model) re-render the group.
function group(props: Record<string, unknown> | (() => Record<string, unknown>) = {}, itemSlots: Record<string, any> = {}) {
  const read = typeof props === 'function' ? props : () => props
  return mount(() => h(RadioButtonGroup, { label: 'Plan', ...read() }, () => plans.map(plan => h(RadioButtonGroupItem, { key: plan.value, ...plan }, itemSlots))), { attachTo: document.body })
}

const cards = (w: ReturnType<typeof mount>) => w.findAll('[data-slot=radio-button-group-item]')

describe('RadioButtonGroup', () => {
  it('clicking a card updates v-model and the selected state', async () => {
    const model = ref<string>()
    const w = group(() => ({ 'modelValue': model.value, 'onUpdate:modelValue': (v: string) => (model.value = v) }))
    await cards(w)[1]!.trigger('click')
    expect(model.value).toBe('pro')
    await w.vm.$nextTick()
    expect(cards(w)[1]!.attributes('data-selected')).toBe('true')
    expect(cards(w)[1]!.attributes('aria-checked')).toBe('true')
    expect(cards(w)[0]!.attributes('data-selected')).toBeUndefined()
    w.unmount()
  })

  it('selects defaultValue when uncontrolled; the card is named by its title and described by its description', () => {
    const w = group({ defaultValue: 'starter' })
    const card = cards(w)[0]!
    expect(card.attributes('role')).toBe('radio')
    expect(card.attributes('data-selected')).toBe('true')
    const label = card.get('[data-slot=radio-button-group-item-label]')
    expect(card.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(label.text()).toBe('Starter')
    const description = card.get('[data-slot=radio-button-group-item-description]')
    expect(card.attributes('aria-describedby')).toContain(description.attributes('id'))
    w.unmount()
  })

  it('names the radiogroup with the label', () => {
    const w = group({ id: 'plan' })
    expect(w.get('[role=radiogroup]').attributes('aria-labelledby')).toBe('plan-label')
    expect(w.get('#plan-label').text()).toBe('Plan')
    w.unmount()
  })

  it('a custom indicator replaces the radio dot; indicator false hides it', () => {
    const custom = group({}, { indicator: () => h('svg', { class: 'check' }) })
    const indicator = custom.get('[data-slot=radio-button-group-indicator]')
    expect(indicator.attributes('data-custom')).toBe('true')
    expect(indicator.find('svg.check').exists()).toBe(true)
    expect(indicator.find('[data-slot=radio-control]').exists()).toBe(false)
    custom.unmount()

    const none = mount(() => h(RadioButtonGroup, null, () => h(RadioButtonGroupItem, { value: 'a', label: 'A', indicator: false })))
    expect(none.find('[data-slot=radio-button-group-indicator]').exists()).toBe(false)
  })

  it('passes selected and disabled to the item slots', () => {
    const state = ({ selected, disabled }: RadioButtonGroupItemSlotProps) => `${selected ? 'on' : 'off'}${disabled ? '-disabled' : ''}`
    const w = group({ defaultValue: 'pro' }, {
      label: (p: RadioButtonGroupItemSlotProps) => h('span', { class: 'label-state' }, state(p)),
      default: (p: RadioButtonGroupItemSlotProps) => h('span', { class: 'state' }, state(p)),
    })
    expect(w.findAll('.state').map(s => s.text())).toEqual(['off', 'on', 'off-disabled'])
    expect(w.findAll('.label-state').map(s => s.text())).toEqual(['off', 'on', 'off-disabled'])
    w.unmount()
  })
})

describe('RadioButtonGroup extra content', () => {
  it('describes the card with the default slot content', () => {
    const w = group({}, { default: () => h('span', '€12 / month') })
    const card = cards(w)[0]!
    const extra = card.get('[data-slot=radio-button-group-item-extra]')
    expect(extra.text()).toBe('€12 / month')
    expect(card.attributes('aria-describedby')!.split(' ')).toContain(extra.attributes('id'))
    w.unmount()

    const plain = group()
    expect(plain.find('[data-slot=radio-button-group-item-extra]').exists()).toBe(false)
    plain.unmount()
  })
})

describe('RadioButtonGroup disabled', () => {
  it('a disabled item cannot be selected', async () => {
    const w = group({ defaultValue: 'starter' })
    await cards(w)[2]!.trigger('click')
    expect(cards(w)[0]!.attributes('data-selected')).toBe('true')
    expect(cards(w)[2]!.attributes('data-selected')).toBeUndefined()
    w.unmount()
  })

  it('a disabled group keeps its selection', async () => {
    const onUpdate = (v: string) => { throw new Error(`unexpected ${v}`) }
    const w = group({ 'disabled': true, 'defaultValue': 'pro', 'onUpdate:modelValue': onUpdate })
    await cards(w)[0]!.trigger('click')
    expect(cards(w)[1]!.attributes('data-selected')).toBe('true')
    expect(cards(w).every(c => (c.element as HTMLButtonElement).disabled)).toBe(true)
    w.unmount()
  })

  it('a disabled Fieldset disables the group', async () => {
    const w = mount(() => h(Fieldset, { disabled: true }, () => h(RadioButtonGroup, { defaultValue: 'starter' }, () => plans.map(plan => h(RadioButtonGroupItem, { key: plan.value, ...plan })))), { attachTo: document.body })
    await cards(w)[1]!.trigger('click')
    expect(cards(w)[0]!.attributes('data-selected')).toBe('true')
    expect(cards(w)[1]!.attributes('data-selected')).toBeUndefined()
    expect(cards(w).every(c => (c.element as HTMLButtonElement).disabled)).toBe(true)
    w.unmount()
  })

  it('readonly keeps the selection', async () => {
    const w = group({ readonly: true, defaultValue: 'pro' })
    await cards(w)[0]!.trigger('click')
    expect(cards(w)[1]!.attributes('data-selected')).toBe('true')
    expect(cards(w)[0]!.attributes('data-selected')).toBeUndefined()
    w.unmount()
  })
})

describe('RadioButtonGroup keyboard', () => {
  it('focus entering the group lands on the selected card', async () => {
    const w = group({ defaultValue: 'pro' })
    await flushPromises()
    ;(w.get('[role=radiogroup]').element as HTMLElement).focus()
    await flushPromises()
    expect(document.activeElement).toBe(cards(w)[1]!.element)
    w.unmount()
  })

  it('arrow keys move focus to the next enabled card and select it', async () => {
    const model = ref<string>('starter')
    const w = group(() => ({ 'modelValue': model.value, 'onUpdate:modelValue': (v: string) => (model.value = v) }))
    await flushPromises()
    ;(cards(w)[0]!.element as HTMLElement).focus()
    // Real key timing: Reka flags arrow keys on window keydown (cleared on keyup), its roving group moves focus
    // on the next tick, and the focused radio clicks itself in a timeout while the flag is still set.
    const tick = () => {
      const { promise, resolve } = Promise.withResolvers<void>()
      setTimeout(resolve)
      return promise
    }
    const press = async (key: string) => {
      const card = document.activeElement as HTMLElement
      card.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await flushPromises() // focus moves
      await tick() // the focused radio clicks itself
      await flushPromises()
      card.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
      await flushPromises()
    }
    await press('ArrowDown')
    expect(document.activeElement).toBe(cards(w)[1]!.element)
    expect(model.value).toBe('pro')
    // Enterprise is disabled, so focus wraps to Starter.
    await press('ArrowDown')
    expect(document.activeElement).toBe(cards(w)[0]!.element)
    expect(model.value).toBe('starter')
    await press('ArrowUp')
    expect(document.activeElement).toBe(cards(w)[1]!.element)
    expect(model.value).toBe('pro')
    w.unmount()
  })

  it('Home / End do not move focus', async () => {
    const w = group({ defaultValue: 'pro' })
    const card = cards(w)[1]!
    ;(card.element as HTMLElement).focus()
    for (const key of ['Home', 'End']) {
      await card.trigger('keydown', { key })
      await flushPromises()
      expect(document.activeElement).toBe(card.element)
    }
    w.unmount()
  })
})

describe('RadioButtonGroup form', () => {
  it('required in a native form shows an error until a card is selected', async () => {
    const w = mount(() => h(Form, null, () => h(RadioButtonGroup, { name: 'plan', required: true, errorMessage: 'Pick a plan' }, () => plans.map(plan => h(RadioButtonGroupItem, { key: plan.value, ...plan })))), { attachTo: document.body })
    await flushPromises()
    w.get('form').element.checkValidity()
    await flushPromises()
    expect(w.find('[data-slot=field-error]').text()).toBe('Pick a plan')
    expect(w.get('[role=radiogroup]').attributes('aria-invalid')).toBe('true')
    await cards(w)[0]!.trigger('click')
    await flushPromises()
    expect(w.find('[data-slot=field-error]').exists()).toBe(false)
    w.unmount()
  })

  it('a failed submit focuses the first enabled card', async () => {
    const items = [{ value: 'closed', label: 'Closed', disabled: true }, { value: 'open', label: 'Open' }, { value: 'later', label: 'Later' }]
    const w = mount(() => h(Form, null, () => h(RadioButtonGroup, { name: 'slot', required: true }, () => items.map(item => h(RadioButtonGroupItem, { key: item.value, ...item })))), { attachTo: document.body })
    await flushPromises()
    w.get('form').element.checkValidity()
    await flushPromises()
    expect(document.activeElement).toBe(cards(w)[1]!.element)
    w.unmount()
  })
})

// A native button activates on Space unless a handler cancelled the key; happy-dom has no activation behaviour, so
// the press helper performs it when the keys get through.
async function pressSpace(el: Element) {
  const down = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true })
  const up = new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true, cancelable: true })
  el.dispatchEvent(down)
  el.dispatchEvent(up)
  if (el instanceof HTMLButtonElement && !el.disabled && !down.defaultPrevented && !up.defaultPrevented)
    el.click()
  await flushPromises()
}

// See the arrow-key test above for the timing Reka needs.
async function pressArrow(key: string) {
  const card = document.activeElement as HTMLElement
  card.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve))
  await flushPromises()
  card.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
  await flushPromises()
}

describe('RadioButtonGroup accessibility', () => {
  it.each([
    ['idle', {}],
    ['with a selection', { defaultValue: 'pro' }],
    ['described', { description: 'Billed monthly' }],
    ['disabled', { disabled: true, defaultValue: 'starter' }],
    ['read-only', { readonly: true, defaultValue: 'starter' }],
    ['required', { required: true }],
    ['invalid with an error message', { invalid: true, errorMessage: 'Pick a plan' }],
  ])('has no axe violations when %s', async (_, props) => {
    const w = group(props)
    await expectAccessible(w)
    w.unmount()
  })

  it('has no axe violations with icons, extra content and custom indicators', async () => {
    const w = group({ defaultValue: 'pro' }, {
      icon: () => h('svg', { viewBox: '0 0 24 24' }),
      indicator: () => h('svg', { viewBox: '0 0 24 24' }),
      default: () => h('span', '€12 / month'),
    })
    await expectAccessible(w)
    w.unmount()
  })

  it('has no axe violations inside a form, with its hidden input', async () => {
    const w = mount(() => h('form', null, h(RadioButtonGroup, { label: 'Plan', name: 'plan', required: true, defaultValue: 'starter' }, () =>
      plans.map(plan => h(RadioButtonGroupItem, { key: plan.value, ...plan })))), { attachTo: document.body })
    await flushPromises()
    await expectAccessible(w)
    w.unmount()
  })

  it('every card hears the group description and error after its own description', () => {
    const w = group({ description: 'Billed monthly', invalid: true, errorMessage: 'Pick a plan' })
    const radiogroup = w.get('[role=radiogroup]')
    expect(radiogroup.attributes('aria-invalid')).toBe('true')
    const text = cards(w)[1]!.attributes('aria-describedby')!.split(' ').map(id => document.getElementById(id)?.textContent?.trim())
    expect(text).toEqual(['For teams', 'Billed monthly', 'Pick a plan'])
    w.unmount()
  })

  it('aria-checked and disabled reflect each card; the indicator and icon are hidden from assistive tech', () => {
    const w = group({ defaultValue: 'pro' }, { icon: () => h('svg') })
    expect(cards(w).map(c => c.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(cards(w).map(c => (c.element as HTMLButtonElement).disabled)).toEqual([false, false, true])
    expect(cards(w)[0]!.get('[data-slot=radio-button-group-indicator]').attributes('aria-hidden')).toBe('true')
    expect(cards(w)[0]!.get('[data-slot=radio-button-group-item-icon]').attributes('aria-hidden')).toBe('true')
    w.unmount()
  })

  it('exposes required and read-only on the radiogroup', () => {
    const w = group({ required: true, readonly: true })
    const radiogroup = w.get('[role=radiogroup]')
    expect(radiogroup.attributes('aria-required')).toBe('true')
    expect(radiogroup.attributes('aria-readonly')).toBe('true')
    w.unmount()
  })

  it('focus entering a group without a selection lands on the first card, and Space selects it', async () => {
    const w = group()
    await flushPromises()
    ;(w.get('[role=radiogroup]').element as HTMLElement).focus()
    await flushPromises()
    const first = cards(w)[0]!.element
    expect(document.activeElement).toBe(first)
    await pressSpace(first)
    expect(first.getAttribute('aria-checked')).toBe('true')
    expect(document.activeElement).toBe(first)
    w.unmount()
  })

  it('in a read-only group arrow keys move focus without changing the selection', async () => {
    const onUpdate = (v: string) => { throw new Error(`unexpected ${v}`) }
    const w = group({ 'readonly': true, 'defaultValue': 'starter', 'onUpdate:modelValue': onUpdate })
    await flushPromises()
    ;(cards(w)[0]!.element as HTMLElement).focus()
    await pressArrow('ArrowDown')
    expect(document.activeElement).toBe(cards(w)[1]!.element)
    await pressSpace(cards(w)[1]!.element)
    expect(cards(w).map(c => c.attributes('aria-checked'))).toEqual(['true', 'false', 'false'])
    w.unmount()
  })

  it('a disabled group takes no focus', () => {
    const w = group({ disabled: true })
    const first = cards(w)[0]!.element as HTMLButtonElement
    first.focus()
    expect(document.activeElement).not.toBe(first)
    w.unmount()
  })
})
