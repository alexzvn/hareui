import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import type { CellSelectProps } from '../src/components/cell-select/CellSelect.vue'
import CellSelect from '../src/components/cell-select/CellSelect.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import { expectAccessible } from './a11y'

const items = [
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]
const trigger = '[data-slot=select-trigger]'
const value = '[data-slot=select-value]'
const flush = () => new Promise(r => setTimeout(r, 0))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CellSelect', () => {
  it('renders the row: label, value and indicator inside the trigger', () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'default' } })
    expect(wrapper.attributes('data-slot')).toBe('cell-select')
    const row = wrapper.get(trigger)
    expect(row.get('[data-slot=cell-select-label]').text()).toBe('Theme')
    expect(row.get(value).text()).toBe('Default')
    expect(row.find('[data-slot=select-indicator] svg').exists()).toBe(true)
    // No field label above the row
    expect(wrapper.find('[data-slot=label]').exists()).toBe(false)
  })

  it('the row label names the trigger together with the value', () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'default' } })
    const labelId = wrapper.get('[data-slot=cell-select-label]').attributes('id')
    const valueId = wrapper.get(value).attributes('id')
    expect(wrapper.get(trigger).attributes('aria-labelledby')).toBe(`${labelId} ${valueId}`)
  })

  it('picking an option updates v-model and the value, then closes', async () => {
    const model = ref<any>('default')
    const wrapper = mount(() => h(CellSelect, { 'items': items, 'label': 'Theme', 'modelValue': model.value, 'onUpdate:modelValue': (v: any) => (model.value = v) }), { attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    const options = document.querySelectorAll<HTMLElement>('[role=option]')
    expect([...options].map(o => o.textContent?.trim())).toEqual(['Default', 'Dark', 'System'])
    options[1]!.click()
    await flush()
    expect(model.value).toBe('dark')
    expect(wrapper.get(value).text()).toBe('Dark')
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })

  it('uncontrolled: starts from defaultValue and follows the selection', async () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'default' }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    document.querySelectorAll<HTMLElement>('[role=option]')[2]!.click()
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['system'])
    expect(wrapper.get(value).text()).toBe('System')
    wrapper.unmount()
  })

  it('ArrowDown opens the popover aligned to the end of the row, labelled by the row label', async () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme' }, attachTo: document.body })
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const popover = document.querySelector('[data-slot=select-popover]')
    expect(popover).not.toBeNull()
    expect(popover!.getAttribute('data-align')).toBe('end')
    expect(document.querySelector('[role=listbox]')!.getAttribute('aria-labelledby')).toBe(wrapper.get('[data-slot=cell-select-label]').attributes('id'))
    wrapper.unmount()
  })

  it('opening with the mouse shows no focus ring on the selected option', async () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'dark' }, attachTo: document.body })
    await wrapper.get(trigger).trigger('pointerdown', { button: 0, pointerType: 'mouse' })
    await wrapper.get(trigger).trigger('click')
    await flush()
    const focusedOption = document.querySelector('[role=option][data-focused=true]')
    expect(focusedOption?.textContent?.trim()).toBe('Dark')
    expect(focusedOption!.hasAttribute('data-focus-visible')).toBe(false)
    wrapper.unmount()
  })

  it('opening with the keyboard shows the focus ring on the focused option', async () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'dark' }, attachTo: document.body })
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const focusedOption = document.querySelector('[role=option][data-focused=true]')
    expect(focusedOption).not.toBeNull()
    expect(focusedOption!.getAttribute('data-focus-visible')).toBe('true')
    wrapper.unmount()
  })

  async function openWithKeyboard(props: Record<string, unknown> = {}) {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', defaultValue: 'dark', ...props }, attachTo: document.body })
    wrapper.get<HTMLElement>(trigger).element.focus()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    await flush()
    return wrapper
  }
  const focusedText = () => document.activeElement?.textContent?.trim()
  const press = async (key: string) => {
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    await flush()
  }

  it('has no axe violations idle, with a description, invalid with an error message, and disabled', async () => {
    const cases: Pick<CellSelectProps, keyof CellSelectProps>[] = [
      { items, label: 'Theme' },
      { items, label: 'Theme', defaultValue: 'dark', description: 'Applies to every window' },
      { items, label: 'Theme', invalid: true, errorMessage: 'Pick a theme', description: 'Applies to every window' },
      { items, label: 'Theme', disabled: true, defaultValue: 'system' },
      { items, label: 'Theme', clearable: true, defaultValue: 'dark' },
    ]
    for (const props of cases) {
      const wrapper = mount(CellSelect, { props, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('has no axe violations while open', async () => {
    const wrapper = await openWithKeyboard()
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    await expectAccessible()
    wrapper.unmount()
  })

  it('names the popover dialog after the row label and reflects the expanded state', async () => {
    const wrapper = await openWithKeyboard()
    const labelId = wrapper.get('[data-slot=cell-select-label]').attributes('id')
    expect(wrapper.get(trigger).attributes('aria-expanded')).toBe('true')
    expect(wrapper.get(trigger).attributes('aria-haspopup')).toBe('listbox')
    expect(document.querySelector('[data-slot=select-popover]')!.getAttribute('aria-labelledby')).toBe(labelId)
    expect(document.querySelector('[role=option][aria-selected=true]')?.textContent?.trim()).toBe('Dark')
    wrapper.unmount()
  })

  it('describes the trigger by its description while valid, and only by the error while invalid', () => {
    const valid = mount(CellSelect, { props: { items, label: 'Theme', id: 'v', description: 'Help', errorMessage: 'Bad' } })
    expect(valid.get(trigger).attributes('aria-describedby')).toBe('v-description')
    valid.unmount()
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', id: 'c', description: 'Help', invalid: true, errorMessage: 'Bad' } })
    expect(wrapper.get(trigger).attributes('aria-describedby')).toBe('c-error')
    expect(wrapper.get('#c-error').text()).toBe('Bad')
    expect(wrapper.get(trigger).attributes('aria-invalid')).toBe('true')
    wrapper.unmount()
  })

  it('keyboard: opens on the selected option, arrows move, Enter selects and returns focus; Escape closes', async () => {
    const wrapper = await openWithKeyboard()
    expect(focusedText()).toBe('Dark')
    await press('ArrowDown')
    expect(focusedText()).toBe('System')
    await press('Enter')
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['system'])
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)

    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowUp' })
    await flush()
    await flush()
    expect(focusedText()).toBe('System')
    await press('Escape')
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('disabled blocks opening', async () => {
    const wrapper = mount(CellSelect, { props: { items, label: 'Theme', disabled: true }, attachTo: document.body })
    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })

  it('is disabled by an ancestor Fieldset', async () => {
    const wrapper = mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(CellSelect, { items, label: 'Theme' }) }, attachTo: document.body })
    expect(wrapper.get('[data-slot=cell-select]').attributes('data-disabled')).toBe('true')
    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })
})
