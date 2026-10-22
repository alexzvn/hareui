import type { RadioButtonGroupItemSlotProps } from '../src/components/radio-button-group/RadioButtonGroupItem.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import Form from '../src/components/form/Form.vue'
import RadioButtonGroup from '../src/components/radio-button-group/RadioButtonGroup.vue'
import RadioButtonGroupItem from '../src/components/radio-button-group/RadioButtonGroupItem.vue'

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
