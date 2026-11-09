import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Autocomplete from '@/components/autocomplete/Autocomplete.vue'
import { createHareUI } from '@/config'

// Vitest stubs CSS imports (`?raw` too) to empty strings
const autocompleteCss = readFileSync(
  resolve(import.meta.dirname, '../../src/components/autocomplete/autocomplete.css'),
  'utf8',
)

const items = [{ value: 'florida', label: 'Florida' }]

describe('Autocomplete theme', () => {
  it('required marks the label with an asterisk', () => {
    const wrapper = mount(Autocomplete, {
      props: { items, label: 'State', required: true },
    })

    expect(wrapper.get('[data-slot=label]').classes()).toContain('h-label--required')
  })

  it('maps the secondary variant and fullWidth to the BEM modifiers', () => {
    const wrapper = mount(Autocomplete, { props: { items, variant: 'secondary', fullWidth: true } })

    expect(wrapper.classes()).toEqual([
      'h-autocomplete',
      'h-autocomplete--secondary',
      'h-autocomplete--full-width',
    ])

    expect(wrapper.get('[data-slot=autocomplete-trigger]').classes()).toEqual([
      'h-autocomplete__trigger',
      'h-autocomplete__trigger--full-width',
    ])
  })

  it('keeps the empty clear button out of pointer interaction, unstyled too', () => {
    const wrapper = mount(Autocomplete, {
      props: { items, clearable: true },
      global: { plugins: [createHareUI({ unstyled: true })] },
    })

    expect(wrapper.get('[data-slot=autocomplete-clear-button]').classes()).toEqual([
      'pointer-events-none',
    ])
  })

  // happy-dom applies no stylesheets, so this pairs the rendered hook with the rule that keys on it
  it('keeps the end gutter for the indicator of an item in the popover', async () => {
    const wrapper = mount(Autocomplete, {
      props: { items, defaultValue: 'florida' },
      attachTo: document.body,
    })

    await wrapper.get('[data-slot=autocomplete-trigger]').trigger('click')
    for (let i = 0; i < 5; i++) await flushPromises()

    const item = document.querySelector(
      '.h-autocomplete__popover [data-slot=list-box] [data-slot=list-box-item][aria-selected=true]',
    )

    expect(item?.querySelector('[data-slot=list-box-item-indicator]')).not.toBeNull()

    // The popover's `px-2.5` on its items outranks list-box.css's own `pe-7`, so it must re-add it
    const itemRule = autocompleteCss.slice(
      autocompleteCss.indexOf("& [data-slot='list-box'] [data-slot='list-box-item'] {"),
    )

    expect(itemRule).toMatch(
      /^[^}]*px-2\.5;\s*&:has\(\[data-slot='list-box-item-indicator'\]\) \{\s*@apply pe-7;/,
    )

    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
