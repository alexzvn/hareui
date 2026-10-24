import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import type { DropdownEntry } from '@/components/dropdown/Dropdown.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'

import { expectAccessible } from './a11y'

const fruits: DropdownEntry[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
]

let wrapper: ReturnType<typeof mount> | undefined

const open = (props: Record<string, unknown>) => {
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

const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[data-slot=menu-item]')].find((el) =>
    el.textContent?.includes(label),
  )!
const menuOpen = () => document.querySelector('[data-slot=dropdown-popover]') !== null

const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick()
}

const press = (el: HTMLElement, key: 'Enter' | ' ') => {
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
        {
          type: 'section',
          label: 'Style',
          items: [
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' },
          ],
        },
        {
          type: 'section',
          label: 'Align',
          selectionMode: 'single',
          items: [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ],
        },
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
      trigger.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
      trigger.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
      trigger.click()
      await settle()
      expect(menuOpen()).toBe(false)

      trigger.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
      vi.advanceTimersByTime(500)
      await settle()
      expect(menuOpen()).toBe(true)
      // Releasing after the long press clicks the trigger; that click must not toggle the menu shut.
      trigger.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
      trigger.click()
      await settle()
      expect(menuOpen()).toBe(true)
    } finally {
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

  const key = (el: Element, k: string) => {
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
  const openSubmenu = async (parent: string) => {
    item(parent).focus()
    key(item(parent), 'ArrowRight')
    await nextTick()
  }

  const submenuItems: DropdownEntry[] = [
    {
      value: 'share',
      label: 'Share',
      items: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'Messages' },
      ],
    },
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

  it('Alt+ArrowUp on a long-press trigger opens on the last item', async () => {
    const w = open({ items: actions, trigger: 'longPress', defaultOpen: false })
    await settle()
    const trigger = w.get('[data-testid=trigger]').element as HTMLElement
    trigger.focus()
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        altKey: true,
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(document.activeElement).toBe(item('Delete file'))
  })

  it('a long press opens the menu with the first item focused', async () => {
    // behaviour-final-check D5
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      const w = open({ items: actions, trigger: 'longPress', defaultOpen: false })
      const trigger = w.get('[data-testid=trigger]').element as HTMLElement
      trigger.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
      vi.advanceTimersByTime(500)
      await settle()
      expect(document.activeElement).toBe(item('New file'))
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('dropdown accessibility', () => {
  const rich: DropdownEntry[] = [
    {
      value: 'new',
      label: 'New file',
      description: 'Create a new file',
      kbd: { keys: 'command', content: 'N' },
    },
    {
      value: 'share',
      label: 'Share',
      items: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'Messages' },
      ],
    },
    { type: 'separator' },
    {
      type: 'section',
      label: 'Danger zone',
      items: [
        { value: 'archive', label: 'Archive', disabled: true },
        { value: 'delete', label: 'Delete file', variant: 'danger' },
      ],
    },
  ]

  const trigger = () => document.querySelector<HTMLElement>('[data-testid=trigger]')!
  const menu = () => document.querySelector<HTMLElement>('[role=menu]')
  const key = (el: Element, k: string) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  }
  // Vue drops an event stamped no later than the millisecond its listener was attached, so a key
  // dispatched right after mount can miss Reka's trigger listener. Real presses come later.
  const pastMount = () => new Promise((r) => setTimeout(r, 2))

  it('passes axe while closed', async () => {
    const w = open({ items: fruits, defaultOpen: false })
    await settle()
    await expectAccessible(w)
  })

  it('passes axe while closed with a long-press trigger', async () => {
    const w = open({ items: fruits, defaultOpen: false, trigger: 'longPress' })
    await settle()
    await expectAccessible(w)
  })

  it('passes axe while open with descriptions, shortcuts, a submenu, a separator, a section and a disabled item', async () => {
    open({ items: rich })
    await settle()
    expect(menu()).not.toBeNull()
    await expectAccessible()
  })

  it('passes axe while open with single selection', async () => {
    open({ items: fruits, selectionMode: 'single', defaultValue: ['apple'] })
    await settle()
    await expectAccessible()
  })

  it('passes axe while open with multiple selection and the dot indicator', async () => {
    open({
      items: fruits,
      selectionMode: 'multiple',
      indicator: 'dot',
      defaultValue: ['apple', 'banana'],
    })
    await settle()
    await expectAccessible()
  })

  // `#content-top` renders inside reka's role="menu" (HeroUI renders it beside the menu, in the popover). Text passes;
  // a named <img> fails aria-required-children, so a card next to its own name text uses a decorative image (alt="").
  it('passes axe with a #content-top user card whose avatar is decorative', async () => {
    wrapper = mount(Dropdown, {
      props: { defaultOpen: true, items: fruits },
      slots: {
        default: () => h('button', { 'data-testid': 'trigger' }, 'Open'),
        'content-top': () =>
          h('div', { class: 'px-3 pt-3 pb-1' }, [
            h('img', { src: '/jane.jpg', alt: '' }),
            h('p', 'Jane Doe'),
            h('p', 'jane@example.com'),
          ]),
      },
      attachTo: document.body,
    })
    await settle()
    expect(menu()!.textContent).toContain('jane@example.com')
    await expectAccessible()
  })

  it('passes axe with a submenu open', async () => {
    open({ items: rich })
    await settle()
    item('Share').focus()
    key(item('Share'), 'ArrowRight')
    await nextTick()
    expect(item('Email')).toBeDefined()
    await expectAccessible()
  })

  it('wires the trigger to the menu with aria-haspopup, aria-expanded and aria-controls', async () => {
    const w = open({ items: fruits, defaultOpen: false })
    await settle()
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    await w.setProps({ open: true })
    await settle()
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(trigger().getAttribute('aria-controls')).toBe(menu()!.id)
    expect(document.getElementById(menu()!.getAttribute('aria-labelledby')!)).toBe(trigger())
  })

  it('names items by their label and describes them by description and shortcut', async () => {
    open({ items: rich })
    await settle()
    const newFile = item('New file')
    expect(newFile.getAttribute('role')).toBe('menuitem')
    expect(
      document.getElementById(newFile.getAttribute('aria-labelledby')!)!.textContent?.trim(),
    ).toBe('New file')
    const described = newFile
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id))
    expect(described.every(Boolean)).toBe(true)
    expect(described[0]!.textContent?.trim()).toBe('Create a new file')
    expect(described[1]!.textContent).toContain('N')
  })

  it('exposes sections as labelled groups, separators, disabled items and submenu triggers', async () => {
    open({ items: rich })
    await settle()
    const group = document.querySelector<HTMLElement>('[role=menu] [role=group]')!
    expect(
      document.getElementById(group.getAttribute('aria-labelledby')!)!.textContent?.trim(),
    ).toBe('Danger zone')
    expect(group.contains(item('Delete file'))).toBe(true)
    expect(document.querySelector('[role=menu] [role=separator], [role=menu] hr')).not.toBeNull()
    expect(item('Archive').getAttribute('aria-disabled')).toBe('true')
    expect(item('Share').getAttribute('aria-haspopup')).toBe('menu')
    expect(item('Share').getAttribute('aria-expanded')).toBe('false')
  })

  it('reflects multiple selection with aria-checked on menuitemcheckbox', async () => {
    open({ items: fruits, selectionMode: 'multiple', defaultValue: ['banana'] })
    await settle()
    expect(item('Apple').getAttribute('role')).toBe('menuitemcheckbox')
    expect(item('Apple').getAttribute('aria-checked')).toBe('false')
    expect(item('Banana').getAttribute('aria-checked')).toBe('true')
    item('Apple').click()
    await settle()
    expect(item('Apple').getAttribute('aria-checked')).toBe('true')
  })

  it('Enter, Space and ArrowDown on the trigger open the menu with the first item focused', async () => {
    for (const k of ['Enter', ' ', 'ArrowDown']) {
      open({ items: fruits, defaultOpen: false })
      await settle()
      await pastMount()
      trigger().focus()
      key(trigger(), k)
      await settle()
      expect(menu()).not.toBeNull()
      expect(document.activeElement).toBe(item('Apple'))
      wrapper!.unmount()
      wrapper = undefined
    }
  })

  it('Home and End move to the first and last enabled items, skipping disabled ones', async () => {
    open({
      items: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
        { value: 'c', label: 'Gamma', disabled: true },
      ],
    })
    await settle()
    item('Alpha').focus()
    key(item('Alpha'), 'End')
    await settle()
    expect(document.activeElement).toBe(item('Beta'))
    key(item('Beta'), 'Home')
    await settle()
    expect(document.activeElement).toBe(item('Alpha'))
    key(item('Alpha'), 'ArrowDown')
    key(item('Beta'), 'ArrowDown')
    await settle()
    expect(document.activeElement).toBe(item('Alpha'))
  })

  it('typeahead focuses the next item starting with the typed text', async () => {
    open({
      items: [
        { value: 'new', label: 'New file' },
        { value: 'edit', label: 'Edit file' },
        { value: 'delete', label: 'Delete file' },
      ],
    })
    await settle()
    item('New file').focus()
    key(item('New file'), 'd')
    await settle()
    expect(document.activeElement).toBe(item('Delete file'))
  })

  it('ArrowLeft in a submenu closes it and refocuses its trigger item', async () => {
    open({ items: rich })
    await settle()
    item('Share').focus()
    key(item('Share'), 'ArrowRight')
    await nextTick()
    expect(item('Share').getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(item('Email'))
    key(item('Email'), 'ArrowLeft')
    await settle()
    expect(document.body.textContent).not.toContain('Messages')
    expect(document.activeElement).toBe(item('Share'))
  })

  it('Escape closes the menu and returns focus to the trigger', async () => {
    const w = open({ items: fruits, defaultOpen: false })
    await settle()
    await pastMount()
    trigger().focus()
    key(trigger(), 'Enter')
    await settle()
    expect(document.activeElement).toBe(item('Apple'))
    key(item('Apple'), 'Escape')
    await settle()
    expect(menu()).toBeNull()
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger()))
  })

  it('a disabled trigger does not open from the keyboard', async () => {
    open({ items: fruits, defaultOpen: false, disabled: true })
    await settle()
    trigger().focus()
    key(trigger(), 'Enter')
    key(trigger(), 'ArrowUp')
    await settle()
    expect(menu()).toBeNull()
  })
})
