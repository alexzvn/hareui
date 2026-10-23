import type { ComponentOptions } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Autocomplete from '../src/components/autocomplete/Autocomplete.vue'

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
