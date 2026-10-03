import type { DropdownEntry } from '../src/components/dropdown/Dropdown.vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Dropdown from '../src/components/dropdown/Dropdown.vue'

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

describe('dropdown keyboard navigation', () => {
  const actions: DropdownEntry[] = [
    { value: 'new', label: 'New file' },
    { value: 'edit', label: 'Edit file' },
    { value: 'delete', label: 'Delete file' },
  ]

  function key(el: Element, k: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  }

  const focusAfter = async (from: HTMLElement, k: string) => {
    from.focus()
    key(from, k)
    await settle()
    return document.activeElement
  }

  it('ArrowDown on the last item wraps to the first', async () => {
    // behaviour-final-check D1
    open({ items: actions })
    await settle()
    expect(await focusAfter(item('Edit file'), 'ArrowDown')).toBe(item('Delete file'))
    expect(await focusAfter(item('Delete file'), 'ArrowDown')).toBe(item('New file'))
  })

  it('ArrowUp on the first item wraps to the last', async () => {
    // behaviour-final-check D1
    open({ items: actions })
    await settle()
    expect(await focusAfter(item('Edit file'), 'ArrowUp')).toBe(item('New file'))
    expect(await focusAfter(item('New file'), 'ArrowUp')).toBe(item('Delete file'))
  })

  // happy-dom fires Reka's focus-outside bookkeeping a couple of ticks after a keyboard-opened submenu mounts and
  // that closes it again, so submenu keys are dispatched on the first tick, before it can interfere.
  async function openSubmenu(parent: string) {
    item(parent).focus()
    key(item(parent), 'ArrowRight')
    await nextTick()
  }

  const submenuItems: DropdownEntry[] = [
    { value: 'share', label: 'Share', items: [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'Messages' }] },
    { value: 'delete', label: 'Delete file' },
  ]

  it('wraps inside a submenu too', async () => {
    // behaviour-final-check D1
    open({ items: submenuItems })
    await settle()
    await openSubmenu('Share')
    expect(document.activeElement).toBe(item('Email'))

    key(item('Email'), 'ArrowDown')
    expect(document.activeElement).toBe(item('Messages'))
    key(item('Messages'), 'ArrowDown')
    expect(document.activeElement).toBe(item('Email'))
    key(item('Email'), 'ArrowUp')
    expect(document.activeElement).toBe(item('Messages'))
  })

  it('ArrowUp on the focused trigger opens the menu with the last item focused', async () => {
    // behaviour-final-check D2
    const w = open({ items: actions, defaultOpen: false })
    await settle()
    const trigger = w.get('[data-testid=trigger]').element as HTMLElement
    trigger.focus()
    key(trigger, 'ArrowUp')
    await settle()
    expect(menuOpen()).toBe(true)
    expect(document.activeElement).toBe(item('Delete file'))
  })

  it('PageUp focuses the first item', async () => {
    // behaviour-final-check D3
    open({ items: actions })
    await settle()
    expect(await focusAfter(item('Delete file'), 'PageUp')).toBe(item('New file'))
  })

  it('PageDown focuses the last item', async () => {
    // behaviour-final-check D3
    open({ items: actions })
    await settle()
    expect(await focusAfter(item('New file'), 'PageDown')).toBe(item('Delete file'))
  })

  it('Escape inside a submenu closes only the submenu and refocuses its parent item', async () => {
    // behaviour-final-check D4
    open({ items: submenuItems })
    await settle()
    await openSubmenu('Share')
    expect(document.activeElement).toBe(item('Email'))

    key(item('Email'), 'Escape')
    await settle()
    expect(menuOpen()).toBe(true)
    expect(item('Delete file')).toBeDefined()
    expect(document.body.textContent).not.toContain('Messages')
    expect(document.activeElement).toBe(item('Share'))
  })
})
