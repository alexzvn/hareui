import type { ComponentOptions } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Autocomplete from '../src/components/autocomplete/Autocomplete.vue'
import { expectAccessible } from './a11y'

const items = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California', disabled: true },
  { value: 'texas', label: 'Texas' },
]
const flush = async () => {
  for (let i = 0; i < 5; i++) {
    await nextTick()
    await new Promise(r => setTimeout(r, 0))
  }
}
const options = () => [...document.querySelectorAll<HTMLElement>('[role=option]')]
const texts = () => options().map(o => o.textContent?.trim())
const search = () => document.querySelector<HTMLInputElement>('[data-slot=search-field-input]')
const value = '[data-slot=autocomplete-value]'

afterEach(() => {
  document.body.innerHTML = ''
})

function setup(props: Record<string, any> = {}, slots?: Record<string, any>) {
  const wrapper = mount(Autocomplete, { props: { items, label: 'State', placeholder: 'Select one', ...props }, slots, attachTo: document.body })
  return { wrapper, button: wrapper.get('button[aria-haspopup=listbox]') }
}
async function typeSearch(text: string) {
  const input = search()!
  input.value = text
  input.dispatchEvent(new Event('input'))
  await flush()
}
async function key(el: Element, k: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  await flush()
}

describe('Autocomplete', () => {
  it('opens a popover with a search field that filters the options', async () => {
    const { wrapper } = setup()
    expect(wrapper.get(value).text()).toBe('Select one')
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    expect(search()).not.toBeNull()
    expect(document.activeElement).toBe(search())
    expect(texts()).toEqual(['Florida', 'Delaware', 'California', 'Texas'])
    await typeSearch('DEL')
    expect(texts()).toEqual(['Delaware'])
    wrapper.unmount()
  })

  it('arrow keys move the virtual focus from the search field; Enter selects and closes', async () => {
    const { wrapper } = setup()
    // A keyboard-style click (detail 0) focuses the first option
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    expect(options()[0]!.getAttribute('data-focused')).toBe('true')
    await key(search()!, 'ArrowDown')
    expect(search()!.getAttribute('aria-activedescendant')).toBe(options()[1]!.id)
    expect(options()[1]!.getAttribute('data-focused')).toBe('true')
    await key(search()!, 'ArrowDown')
    // Disabled option skipped
    expect(options()[3]!.getAttribute('data-focused')).toBe('true')
    await key(search()!, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['texas'])
    expect(wrapper.get(value).text()).toBe('Texas')
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })

  it('multiple mode keeps the popover open and lists labels in selection order', async () => {
    const { wrapper } = setup({ selectionMode: 'multiple', modelValue: ['texas'] })
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    options()[0]!.click()
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect(last).toEqual(['texas', 'florida'])
    await wrapper.setProps({ modelValue: last })
    expect(wrapper.get(value).text()).toBe('Texas and Florida')
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    wrapper.unmount()
  })

  it('clear button resets the selection and emits clear without opening', async () => {
    const { wrapper } = setup({ clearable: true, defaultValue: 'florida' })
    const clear = wrapper.get('[data-slot=autocomplete-clear-button]')
    expect(clear.attributes('data-empty')).toBeUndefined()
    await clear.trigger('click')
    await flush()
    expect(wrapper.get(value).attributes('data-placeholder')).toBe('true')
    expect(clear.attributes('data-empty')).toBe('true')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })

  it('renders the #empty slot when nothing matches, and sections with headers', async () => {
    const sections = [
      { type: 'section', label: 'South', items: [{ value: 'florida', label: 'Florida' }] },
      { type: 'separator' },
      { type: 'section', label: 'West', items: [{ value: 'nevada', label: 'Nevada' }] },
    ]
    const { wrapper } = setup({ items: sections, defaultOpen: true }, { empty: () => 'No results found' })
    await flush()
    expect([...document.querySelectorAll('[data-slot=header]')].map(e => e.textContent?.trim())).toEqual(['South', 'West'])
    await typeSearch('nev')
    expect([...document.querySelectorAll('[data-slot=header]')].map(e => e.textContent?.trim())).toEqual(['West'])
    await typeSearch('zzz')
    expect(document.querySelector('[data-slot=empty-state]')?.textContent?.trim()).toBe('No results found')
    wrapper.unmount()
  })

  it('without search, the popover takes focus and Space toggles the focused option', async () => {
    const { wrapper } = setup({ search: false, selectionMode: 'multiple', defaultOpen: true })
    await flush()
    expect(search()).toBeNull()
    const popover = document.querySelector<HTMLElement>('[data-slot=autocomplete-popover]')!
    await key(popover, 'ArrowDown')
    await key(popover, ' ')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['florida']])
    wrapper.unmount()
  })

  it('submits through a hidden select; disabled does not open', async () => {
    const { wrapper } = setup({ name: 'state', defaultValue: 'texas' })
    expect(wrapper.get<HTMLSelectElement>('select').element.value).toBe('texas')
    wrapper.unmount()
    const disabled = setup({ disabled: true })
    await disabled.wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(disabled.wrapper.get('[data-slot=autocomplete-trigger]').attributes('data-disabled')).toBe('true')
    disabled.wrapper.unmount()
  })

  it('custom indicator, v-model:input-value and filter=false', async () => {
    const { wrapper } = setup({ inputValue: 'zzz', filter: false, defaultOpen: true }, { indicator: () => h('i', { class: 'custom' }) })
    await flush()
    expect(wrapper.find('i.custom[data-slot=autocomplete-indicator]').exists()).toBe(true)
    expect(search()!.value).toBe('zzz')
    expect(texts()).toHaveLength(4)
    await typeSearch('flo')
    expect(wrapper.emitted('update:inputValue')?.at(-1)).toEqual(['flo'])
    wrapper.unmount()
  })

  it('ArrowDown re-renders only the previously and newly focused options', async () => {
    const updated = new Set<string>()
    const countOptionUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches('[role=option]'))
          updated.add(this.$el.textContent!.trim())
      },
    }
    const wrapper = mount(Autocomplete, { props: { items, label: 'State' }, attachTo: document.body, global: { mixins: [countOptionUpdates] } })
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    await key(search()!, 'ArrowDown')
    updated.clear()
    await key(search()!, 'ArrowDown')
    expect(options()[3]!.getAttribute('data-focused')).toBe('true')
    expect([...updated].sort()).toEqual(['Delaware', 'Texas'])
    wrapper.unmount()
  })
})

describe('Autocomplete behaviour parity (React Aria)', () => {
  it('a mouse press opens on pointerdown, and the click that ends it keeps the popover open', async () => {
    // behaviour-final-check A1 (RAC Select trigger opens on press start)
    const { wrapper, button } = setup()
    const el = wrapper.get('[data-slot=autocomplete-trigger]').element
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, pointerType: 'mouse' }))
    await flush()
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    await flush()
    expect(button.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('pressing one option, moving to another and releasing selects the option under the pointer', async () => {
    // behaviour-final-check A1
    const { wrapper } = setup()
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
    const pointer = (el: Element, type: string) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, pointerType: 'mouse' }))
    pointer(options()[0]!, 'pointerdown')
    pointer(options()[3]!, 'pointerup')
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['texas'])
    expect(wrapper.get(value).text()).toBe('Texas')
    expect(document.querySelector('[role=listbox]')).toBeNull()
    wrapper.unmount()
  })
})

describe('Autocomplete virtualize', () => {
  const users = Array.from({ length: 300 }, (_, i) => ({ value: i + 1, label: `User ${i + 1}` }))

  it('renders only part of a long list and keeps keyboard focus by value', async () => {
    const { wrapper } = setup({ items: users, virtualize: { estimateSize: 50 }, defaultOpen: true })
    await flush()
    // happy-dom has no layout, so the virtualizer mounts (almost) nothing; never all 300 rows
    expect(options().length).toBeLessThan(300)
    expect(document.querySelector('[data-reka-virtualizer]')).not.toBeNull()
    await key(search()!, 'ArrowDown')
    expect(search()!.getAttribute('aria-activedescendant')).toMatch(/-option-1$/)
    await key(search()!, 'End')
    // The last row may not be mounted, but the active descendant points at it
    expect(search()!.getAttribute('aria-activedescendant')).toMatch(/-option-300$/)
    await key(search()!, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([300])
    wrapper.unmount()
  })

  it('filters before virtualizing', async () => {
    const { wrapper } = setup({ items: users, virtualize: true, defaultOpen: true })
    await flush()
    await typeSearch('User 29')
    // Typing focuses the first match, even when its row isn't mounted
    expect(search()!.getAttribute('aria-activedescendant')).toMatch(/-option-29$/)
    expect(texts().every(t => t?.startsWith('User 29'))).toBe(true)
    wrapper.unmount()
  })
})

describe('Autocomplete accessibility', () => {
  /** The text an `aria-labelledby` / `aria-describedby` list points at; fails on dangling ids. */
  const refText = (ids: string | null | undefined) => (ids ?? '').split(' ').filter(Boolean).map((id) => {
    const el = document.getElementById(id)
    expect(el, `#${id} exists`).not.toBeNull()
    return el!.getAttribute('aria-label') ?? el!.textContent!.trim()
  }).join(' ')
  const listbox = () => document.querySelector<HTMLElement>('[role=listbox]')
  const popover = () => document.querySelector<HTMLElement>('[data-slot=autocomplete-popover]')
  async function open(wrapper: ReturnType<typeof setup>['wrapper']) {
    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    await flush()
  }

  it('has no axe violations closed: placeholder, selected, with a description, clearable and disabled', async () => {
    for (const props of [{}, { defaultValue: 'texas', description: 'Where you live' }, { clearable: true, defaultValue: 'florida' }, { clearable: true }, { disabled: true }]) {
      const { wrapper } = setup(props)
      await flush()
      await expectAccessible()
      wrapper.unmount()
    }
  })

  it('has no axe violations when invalid with an error message', async () => {
    const { wrapper, button } = setup({ invalid: true, errorMessage: 'Pick a state' })
    await flush()
    expect(button.attributes('aria-invalid')).toBe('true')
    expect(refText(button.attributes('aria-describedby'))).toBe('Pick a state')
    await expectAccessible()
    wrapper.unmount()
  })

  it('required sits on the hidden select and the label mark, as RAC Select does, not on the trigger button', async () => {
    const { wrapper, button } = setup({ required: true })
    await flush()
    expect(button.attributes('aria-required')).toBeUndefined()
    expect(wrapper.get('select').attributes('required')).toBeDefined()
    expect(wrapper.attributes('data-required')).toBe('true')
    expect(wrapper.get('[data-slot=label]').classes()).toContain('after:content-[\'*\']')
    await expectAccessible()
    wrapper.unmount()
  })

  it('has no axe violations open with the search field, a focused, a selected and a disabled option', async () => {
    const { wrapper } = setup({ defaultValue: 'delaware' })
    await open(wrapper)
    await key(search()!, 'ArrowDown')
    expect(search()!.getAttribute('aria-activedescendant')).toBeTruthy()
    await expectAccessible()
    wrapper.unmount()
  })

  it('has no axe violations open without search, in multiple mode and with the empty state', async () => {
    for (const props of [{ search: false }, { selectionMode: 'multiple', defaultValue: ['texas'] }]) {
      const { wrapper } = setup(props)
      await open(wrapper)
      await expectAccessible()
      wrapper.unmount()
    }
    const { wrapper } = setup({}, { empty: () => 'No results found' })
    await open(wrapper)
    await typeSearch('zzz')
    expect(document.querySelector('[data-slot=empty-state]')).not.toBeNull()
    await expectAccessible()
    wrapper.unmount()
  })

  it('names the trigger from the value and the label, and the popup parts from the label', async () => {
    const { wrapper, button } = setup({ defaultValue: 'texas', description: 'Where you live' })
    expect(refText(button.attributes('aria-labelledby'))).toBe('Texas State')
    expect(refText(button.attributes('aria-describedby'))).toBe('Where you live')
    await open(wrapper)
    expect(popover()!.getAttribute('role')).toBe('dialog')
    expect(refText(popover()!.getAttribute('aria-labelledby'))).toBe('State')
    expect(search()!.getAttribute('aria-label')).toBe('Search options')
    expect(refText(listbox()!.getAttribute('aria-labelledby'))).toBe('Suggestions State')
    wrapper.unmount()
  })

  it('an aria-label still names the trigger and the popup when there is no visible label', async () => {
    const wrapper = mount(Autocomplete, { props: { items, placeholder: 'Select one' }, attrs: { 'aria-label': 'State' }, attachTo: document.body })
    const button = wrapper.get('button[aria-haspopup=listbox]')
    expect(refText(button.attributes('aria-labelledby'))).toBe('Select one State')
    await open(wrapper)
    expect(refText(popover()!.getAttribute('aria-labelledby'))).toBe('State')
    await expectAccessible()
    wrapper.unmount()
  })

  it('aria-expanded / aria-controls follow the popup; the search field controls the listbox', async () => {
    const { wrapper, button } = setup()
    expect(button.attributes('aria-haspopup')).toBe('listbox')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.attributes('aria-controls')).toBeUndefined()
    await open(wrapper)
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-controls')).toBe(listbox()!.id)
    expect(search()!.getAttribute('aria-controls')).toBe(listbox()!.id)
    expect(search()!.getAttribute('aria-autocomplete')).toBe('list')
    wrapper.unmount()
  })

  it('options expose aria-selected and aria-disabled; multiple mode is aria-multiselectable', async () => {
    const single = setup({ defaultValue: 'texas' })
    try {
      await open(single.wrapper)
      expect(options().map(o => o.getAttribute('aria-selected'))).toEqual(['false', 'false', 'false', 'true'])
      expect(listbox()!.getAttribute('aria-multiselectable')).not.toBe('true')
      expect(options()[2]!.getAttribute('aria-disabled')).toBe('true')
    }
    finally {
      single.wrapper.unmount()
    }
    const multi = setup({ selectionMode: 'multiple', defaultValue: ['florida', 'texas'] })
    await open(multi.wrapper)
    expect(listbox()!.getAttribute('aria-multiselectable')).toBe('true')
    expect(options().map(o => o.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false', 'true'])
    multi.wrapper.unmount()
  })

  it('Enter, Space and ArrowDown on the trigger open on the first option, ArrowUp on the last enabled one', async () => {
    for (const k of ['Enter', ' ', 'ArrowDown']) {
      const { wrapper, button } = setup()
      await key(button.element, k)
      expect(button.attributes('aria-expanded')).toBe('true')
      expect(search()!.getAttribute('aria-activedescendant')).toBe(options()[0]!.id)
      wrapper.unmount()
    }
    const { wrapper, button } = setup({ items: [...items.slice(0, 3), { value: 'utah', label: 'Utah', disabled: true }] })
    await key(button.element, 'ArrowUp')
    // Utah (last) and California are disabled
    expect(search()!.getAttribute('aria-activedescendant')).toBe(options()[1]!.id)
    wrapper.unmount()
  })

  it('Home / End in the search field move to the first / last enabled option', async () => {
    const { wrapper } = setup()
    await open(wrapper)
    await key(search()!, 'End')
    expect(search()!.getAttribute('aria-activedescendant')).toBe(options()[3]!.id)
    await key(search()!, 'Home')
    expect(search()!.getAttribute('aria-activedescendant')).toBe(options()[0]!.id)
    wrapper.unmount()
  })

  it('focus moves into the search field on open and back to the trigger on Escape', async () => {
    const { wrapper, button } = setup()
    ;(button.element as HTMLElement).focus()
    await key(button.element, 'Enter')
    expect(document.activeElement).toBe(search())
    await typeSearch('tex')
    // The first Escape clears the search, the second closes
    await key(search()!, 'Escape')
    expect(search()!.value).toBe('')
    expect(button.attributes('aria-expanded')).toBe('true')
    await key(search()!, 'Escape')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button.element)
    wrapper.unmount()
  })

  it('focus moves to the popover without search and back to the trigger after a selection', async () => {
    const { wrapper, button } = setup({ search: false })
    ;(button.element as HTMLElement).focus()
    await key(button.element, 'ArrowDown')
    expect(document.activeElement).toBe(popover())
    expect(popover()!.getAttribute('tabindex')).toBe('-1')
    await key(popover()!, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['florida'])
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button.element)
    wrapper.unmount()
  })

  it('the clear button stays out of the tab order; Backspace on the trigger clears instead', async () => {
    const { wrapper, button } = setup({ clearable: true, defaultValue: 'florida' })
    const clear = wrapper.get('[data-slot=autocomplete-clear-button]')
    expect(clear.attributes('tabindex')).toBe('-1')
    expect(clear.attributes('aria-label')).toBe('Clear selection')
    expect(clear.attributes('aria-hidden')).toBeUndefined()
    await key(button.element, 'Backspace')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    // With nothing to clear it is hidden from assistive technology
    expect(clear.attributes('aria-hidden')).toBe('true')
    expect(button.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('a disabled autocomplete is not focusable and does not open from the keyboard', async () => {
    const { wrapper, button } = setup({ disabled: true })
    expect((button.element as HTMLButtonElement).disabled).toBe(true)
    await key(button.element, 'ArrowDown')
    expect(button.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
