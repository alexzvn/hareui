import type { DropdownEntry } from '../src/components/Dropdown.vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Dropdown from '../src/components/Dropdown.vue'

const fruits: DropdownEntry[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
]

let wrapper: ReturnType<typeof mount> | undefined

function open(props: Record<string, unknown>) {
  wrapper = mount(Dropdown, {
    props: { defaultOpen: true, ...props },
    slots: { default: () => h('button', { 'data-testid': 'trigger' }, 'Open') },
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

const item = (label: string) => [...document.querySelectorAll<HTMLElement>('[data-slot=menu-item]')].find(el => el.textContent?.includes(label))!
const menuOpen = () => document.querySelector('[data-slot=dropdown-popover]') !== null

async function settle() {
  for (let i = 0; i < 4; i++)
    await nextTick()
}

function press(el: HTMLElement, key: 'Enter' | ' ') {
  el.focus()
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

describe('dropdown', () => {
  it('emits action for plain items and closes', async () => {
    const w = open({ items: fruits })
    await settle()
    item('Banana').click()
    await settle()
    expect(w.emitted('action')).toEqual([['banana']])
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('marks the trigger pressed only while the menu is open', async () => {
    const w = open({ items: fruits })
    await settle()
    expect(w.get('[data-testid=trigger]').attributes('data-pressed')).toBe('true')
    await w.setProps({ open: false })
    await settle()
    expect(w.get('[data-testid=trigger]').attributes('data-pressed')).toBeUndefined()
  })

  it('single selection replaces the value and closes', async () => {
    const w = open({ items: fruits, selectionMode: 'single', defaultValue: ['apple'] })
    await settle()
    expect(item('Apple').getAttribute('aria-checked')).toBe('true')
    expect(item('Apple').getAttribute('role')).toBe('menuitemradio')
    item('Banana').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']])
    expect(menuOpen()).toBe(false)
  })

  it('multiple selection toggles and keeps the menu open on pointer select', async () => {
    const w = open({ items: fruits, selectionMode: 'multiple', defaultValue: ['apple'] })
    await settle()
    item('Banana').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple', 'banana']])
    item('Apple').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']])
    expect(menuOpen()).toBe(true)
  })

  it('space toggles a selectable item and keeps the menu open, enter closes', async () => {
    const w = open({ items: fruits, selectionMode: 'single' })
    await settle()
    press(item('Banana'), ' ')
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']])
    expect(menuOpen()).toBe(true)
    press(item('Apple'), 'Enter')
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']])
    expect(menuOpen()).toBe(false)
  })

  it('a section with its own single mode only replaces its own value', async () => {
    const w = open({
      selectionMode: 'multiple',
      defaultValue: ['bold', 'left'],
      items: [
        { type: 'section', label: 'Style', items: [{ value: 'bold', label: 'Bold' }, { value: 'italic', label: 'Italic' }] },
        { type: 'section', label: 'Align', selectionMode: 'single', items: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] },
      ],
    })
    await settle()
    item('Right').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['bold', 'right']])
  })

  it('ignores disabled items', async () => {
    const w = open({ items: fruits, selectionMode: 'single' })
    await settle()
    expect(item('Cherry').hasAttribute('data-disabled')).toBe(true)
    item('Cherry').click()
    await settle()
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('focuses the first selected item on open, like React Aria', async () => {
    open({ items: fruits, selectionMode: 'single', defaultValue: ['banana'] })
    await settle()
    expect(document.activeElement).toBe(item('Banana'))
  })

  it('long press trigger ignores a plain click and opens after the hold threshold', async () => {
    // Timeouts only: a frozen `Date` makes Vue's event invoker skip listeners attached at the same instant
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      const w = open({ items: fruits, trigger: 'longPress', defaultOpen: false })
      const trigger = w.get('[data-testid=trigger]').element as HTMLElement
      trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }))
      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
      trigger.click()
      await settle()
      expect(menuOpen()).toBe(false)

      trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }))
      vi.advanceTimersByTime(500)
      await settle()
      expect(menuOpen()).toBe(true)
      // Releasing after the long press clicks the trigger; that click must not toggle the menu shut.
      trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
      trigger.click()
      await settle()
      expect(menuOpen()).toBe(true)
    }
    finally {
      vi.useRealTimers()
    }
  })
})
