import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import type { ContextMenuEntry, ContextMenuItemSlotProps } from '@/components/context-menu'
import { ContextMenu } from '@/components/context-menu'

import { expectAccessible } from './a11y'
import { settle } from './settle'

const actions: ContextMenuEntry[] = [
  { value: 'copy', label: 'Copy', kbd: { keys: 'command', content: 'C' } },
  { value: 'paste', label: 'Paste' },
  { value: 'cut', label: 'Cut', disabled: true },
]

let wrapper: ReturnType<typeof mount> | undefined

type MountOptions = {
  props?: Record<string, unknown>
  slots?: Record<string, (props: ContextMenuItemSlotProps) => unknown>
}

const render = ({ props = {}, slots = {} }: MountOptions = {}) => {
  wrapper = mount(ContextMenu, {
    props: { items: actions, ...props },
    slots: { default: () => h('p', 'Right-click the card'), ...slots },
    attachTo: document.body,
  })

  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

// Vue drops an event stamped no later than the millisecond its listener was attached.
const pastMount = () => new Promise((resolve) => setTimeout(resolve, 2))

const trigger = () => document.querySelector<HTMLElement>('[data-slot=context-menu-trigger]')!
const menu = () => document.querySelector<HTMLElement>('[role=menu]')

const item = (label: string) =>
  [...document.querySelectorAll<HTMLElement>('[data-slot=menu-item]')].find((el) =>
    el.textContent?.includes(label),
  )!

const rightClick = async () => {
  await pastMount()

  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: 40,
    clientY: 30,
  })

  trigger().dispatchEvent(event)
  await settle()

  return event
}

const key = (el: Element, k: string) => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
}

describe('context menu', () => {
  it('opens on right click and prevents the browser menu', async () => {
    const w = render()
    expect(menu()).toBeNull()
    const event = await rightClick()
    expect(menu()).not.toBeNull()
    expect(event.defaultPrevented).toBe(true)
    expect(w.emitted('update:open')).toEqual([[true]])
  })

  it('keeps the browser menu and stays closed when disabled', async () => {
    const w = render({ props: { disabled: true } })
    const event = await rightClick()
    expect(menu()).toBeNull()
    expect(event.defaultPrevented).toBe(false)
    expect(w.emitted('update:open')).toBeUndefined()
  })

  it('emits action for an item and closes', async () => {
    const w = render()
    await rightClick()
    item('Paste').click()
    await settle()
    expect(w.emitted('action')).toEqual([['paste']])
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('ignores disabled items', async () => {
    const w = render()
    await rightClick()
    expect(item('Cut').getAttribute('aria-disabled')).toBe('true')
    item('Cut').click()
    await settle()
    expect(w.emitted('action')).toBeUndefined()
  })

  it('follows the controlled open prop without emitting it back', async () => {
    const w = render({ props: { open: true } })
    await settle()
    expect(menu()).not.toBeNull()
    await w.setProps({ open: false })
    await settle()
    expect(menu()).toBeNull()
    expect(w.emitted('update:open')).toBeUndefined()
  })

  it('stays closed on right click while the controlled open prop is false', async () => {
    const w = render({ props: { open: false } })
    await rightClick()
    await settle()
    expect(w.emitted('update:open')).toEqual([[true]])
    expect(menu()).toBeNull()
  })

  it('stays open on Escape while the controlled open prop is true', async () => {
    const w = render({ props: { open: true } })
    await settle()
    key(menu()!, 'Escape')
    await settle()
    expect(w.emitted('update:open')).toEqual([[false]])
    expect(menu()).not.toBeNull()
  })

  it('closes on Escape', async () => {
    const w = render()
    await rightClick()
    key(menu()!, 'Escape')
    await settle()
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    expect(menu()).toBeNull()
  })

  it('renders an array of groups with a separator between groups', async () => {
    render({
      props: {
        items: [
          [{ value: 'open', label: 'Open' }],
          [],
          [{ value: 'rename', label: 'Rename' }],
          [{ value: 'delete', label: 'Delete' }],
        ],
        defaultOpen: true,
      },
    })

    await settle()
    const children = [...document.querySelectorAll('[data-slot=context-menu-menu] > *')]
    const slots = children.map((el) => el.getAttribute('data-slot'))
    expect(slots).toEqual(['menu-item', 'separator', 'menu-item', 'separator', 'menu-item'])
  })

  it('replaces the value in single selection and closes', async () => {
    const w = render({
      props: { selectionMode: 'single', defaultValue: ['copy'], defaultOpen: true },
    })

    await settle()
    expect(item('Copy').getAttribute('role')).toBe('menuitemradio')
    expect(item('Copy').getAttribute('aria-checked')).toBe('true')
    item('Paste').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['paste']])
    expect(menu()).toBeNull()
  })

  it('toggles a section with multiple selection and keeps the menu open', async () => {
    const w = render({
      props: {
        items: [
          {
            type: 'section',
            label: 'Panels',
            selectionMode: 'multiple',
            items: [
              { value: 'layers', label: 'Layers' },
              { value: 'assets', label: 'Assets' },
            ],
          },
        ],
        modelValue: ['layers'],
        defaultOpen: true,
      },
    })

    await settle()
    expect(item('Layers').getAttribute('role')).toBe('menuitemcheckbox')
    item('Assets').click()
    await settle()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['layers', 'assets']])
    expect(menu()).not.toBeNull()
  })

  it('focuses the first selected item on open', async () => {
    render({ props: { selectionMode: 'single', defaultValue: ['paste'] } })
    await rightClick()
    expect(document.activeElement).toBe(item('Paste'))
  })

  // happy-dom's focus-outside bookkeeping closes a keyboard-opened submenu a couple of ticks after it
  // mounts, so the submenu is checked on the first tick.
  it('opens a submenu from its trigger item with ArrowRight and focuses its first item', async () => {
    render({
      props: {
        items: [
          {
            value: 'share',
            label: 'Share',
            items: [{ value: 'email', label: 'Email' }],
          },
        ],
        defaultOpen: true,
      },
    })

    await settle()
    const share = item('Share')
    expect(share.getAttribute('aria-haspopup')).toBe('menu')
    share.focus()
    key(share, 'ArrowRight')
    await nextTick()
    expect(share.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(item('Email'))
  })

  it('names items by label and describes them by their shortcut', async () => {
    render({ props: { defaultOpen: true } })
    await settle()
    const copy = item('Copy')
    const label = document.getElementById(copy.getAttribute('aria-labelledby')!)
    const shortcut = document.getElementById(copy.getAttribute('aria-describedby')!)
    expect(label?.textContent?.trim()).toBe('Copy')
    expect(shortcut?.tagName).toBe('KBD')
  })

  it('renders the content and item slots', async () => {
    render({
      props: { defaultOpen: true },
      slots: {
        'content-top': () => h('p', { 'data-testid': 'top' }, '3 files'),
        'content-bottom': () => h('p', { 'data-testid': 'bottom' }, 'Synced'),
        'item-leading': ({ item: entry }) => [h('span', { 'data-testid': `icon-${entry.value}` })],
      },
    })

    await settle()
    expect(document.querySelector('[data-testid=top]')?.textContent).toBe('3 files')
    expect(document.querySelector('[data-testid=bottom]')?.textContent).toBe('Synced')
    expect(item('Paste').querySelector('[data-testid=icon-paste]')).not.toBeNull()
  })

  it('passes attributes to the trigger area', () => {
    render({ props: { tabindex: '0', 'aria-label': 'Canvas' } })
    expect(trigger().getAttribute('tabindex')).toBe('0')
    expect(trigger().getAttribute('aria-label')).toBe('Canvas')
  })

  it('makes the page outside a modal menu inert', async () => {
    const outside = document.body.appendChild(document.createElement('button'))
    render()
    await rightClick()
    expect(outside.hasAttribute('inert')).toBe(true)
    outside.remove()
  })

  it('leaves the page interactive with modal set to false', async () => {
    const outside = document.body.appendChild(document.createElement('button'))
    render({ props: { modal: false } })
    await rightClick()
    expect(menu()).not.toBeNull()
    expect(outside.hasAttribute('inert')).toBe(false)
    outside.remove()
  })
})

describe('context menu accessibility', () => {
  it('passes axe while closed', async () => {
    const w = render()
    await settle()
    await expectAccessible(w)
  })

  it('passes axe while open with sections, a separator, shortcuts and a disabled item', async () => {
    render({
      props: {
        items: [
          ...actions,
          { type: 'separator' },
          {
            type: 'section',
            label: 'Arrange',
            selectionMode: 'single',
            indicator: 'dot',
            items: [
              { value: 'front', label: 'Bring to front' },
              { value: 'back', label: 'Send to back' },
            ],
          },
        ],
        defaultValue: ['front'],
      },
    })

    await rightClick()
    expect(menu()).not.toBeNull()
    await expectAccessible()
  })
})
