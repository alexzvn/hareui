import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { h } from 'vue'

import AlertDialog from '@/components/alert-dialog/AlertDialog.vue'
import App from '@/components/app/App.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'
import Popover from '@/components/popover/Popover.vue'
import { useOverlay } from '@/composables/useOverlay'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.querySelectorAll('[data-outside]').forEach((el) => el.remove())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// Reka's Presence and DismissableLayer settle over several ticks and one task.
const settle = async () => {
  for (let i = 0; i < 5; i++) await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  for (let i = 0; i < 5; i++) await flushPromises()
}

const escapeKeydown = () => {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  )
}

const pressOutside = (init: PointerEventInit = {}) => {
  const outside = document.createElement('button')
  outside.textContent = 'Outside'
  outside.dataset.outside = ''
  document.body.prepend(outside)

  outside.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse', ...init }),
  )
}

const LIFECYCLE = ['enter', 'after:enter', 'leave', 'after:leave']

const dialogs: [string, Component, string][] = [
  ['Modal', Modal, 'dialog'],
  ['AlertDialog', AlertDialog, 'alertdialog'],
  ['Drawer', Drawer, 'dialog'],
]

describe.each(dialogs)('%s events', (_, component, role) => {
  const mountDialog = (props: Record<string, unknown> = {}) => {
    const events: string[] = []
    const listeners = Object.fromEntries(
      [...LIFECYCLE, 'close:prevent'].map((name) => [
        `on${name[0]!.toUpperCase()}${name.slice(1)}`,
        () => events.push(name),
      ]),
    )

    const wrapper = mount(component, {
      props: { title: 'Title', ...listeners, ...props },
      slots: { body: () => h('p', 'Body') },
      attachTo: document.body,
    })

    return { wrapper, events }
  }

  const dialog = () => document.querySelector(`[role=${role}]`)

  it('emits enter, after:enter, leave, after:leave in order', async () => {
    const { wrapper, events } = mountDialog({ open: false })
    await wrapper.setProps({ open: true })
    await settle()
    await wrapper.setProps({ open: false })
    await settle()

    expect(events).toEqual(LIFECYCLE)
  })

  it('emits after:enter right after enter when there is no animation', async () => {
    const { events } = mountDialog({ defaultOpen: true })
    await settle()

    expect(events).toEqual(['enter', 'after:enter'])
  })

  it('emits after:leave only once the dialog left the DOM', async () => {
    let wasMounted: boolean | undefined
    const { wrapper } = mountDialog({
      open: true,
      'onAfter:leave': () => {
        wasMounted = !!dialog()
      },
    })

    await settle()
    await wrapper.setProps({ open: false })
    await settle()

    expect(wasMounted).toBe(false)
  })

  it('emits close:prevent on Escape when not dismissible', async () => {
    const { events } = mountDialog({
      defaultOpen: true,
      dismissible: false,
      keyboardDismissible: false,
    })

    await settle()
    escapeKeydown()
    await settle()

    expect(events).toContain('close:prevent')
    expect(dialog()).not.toBeNull()
  })

  it('emits close:prevent on an outside press when not dismissible', async () => {
    const { events } = mountDialog({ defaultOpen: true, dismissible: false })
    await settle()
    pressOutside()
    await settle()

    expect(events).toContain('close:prevent')
    expect(dialog()).not.toBeNull()
  })

  it.each<[string, PointerEventInit]>([
    ['a right click', { button: 2 }],
    ['a Ctrl+click', { ctrlKey: true }],
  ])('does not emit close:prevent on %s outside when not dismissible', async (_, init) => {
    const { events } = mountDialog({ defaultOpen: true, dismissible: false })
    await settle()
    pressOutside(init)
    await settle()

    expect(events).not.toContain('close:prevent')
    expect(dialog()).not.toBeNull()
  })

  it('does not emit close:prevent when dismissible', async () => {
    const { events } = mountDialog({
      defaultOpen: true,
      dismissible: true,
      keyboardDismissible: true,
    })

    await settle()
    pressOutside()
    escapeKeydown()
    await settle()

    expect(events).not.toContain('close:prevent')
  })
})

describe('Popover close:prevent', () => {
  const mountPopover = (props: Record<string, unknown> = {}) =>
    mount(Popover, {
      props: { defaultOpen: true, title: 'Title', ...props },
      slots: { default: () => h('button', 'Open'), content: () => h('p', 'Content') },
      attachTo: document.body,
    })

  it('emits close:prevent on Escape when not dismissible', async () => {
    const wrapper = mountPopover({ dismissible: false })
    await settle()
    escapeKeydown()
    await settle()

    expect(wrapper.emitted('close:prevent')).toHaveLength(1)
  })

  it('emits close:prevent on an outside press when not dismissible', async () => {
    const wrapper = mountPopover({ dismissible: false })
    await settle()
    pressOutside()
    await settle()

    expect(wrapper.emitted('close:prevent')).toHaveLength(1)
  })

  it('does not emit close:prevent when dismissible', async () => {
    const wrapper = mountPopover()
    await settle()
    pressOutside()
    escapeKeydown()
    await settle()

    expect(wrapper.emitted('close:prevent')).toBeUndefined()
  })
})

describe('Popover hover mode', () => {
  const mountHover = () =>
    mount(Popover, {
      props: { mode: 'hover', title: 'Title' },
      slots: { default: () => h('button', 'Hover me'), content: () => h('p', 'Hover content') },
      attachTo: document.body,
    })

  const trigger = () => document.querySelector('button')!
  const content = () => document.querySelector('[data-slot=popover]')

  const pointer = (type: string) =>
    trigger().dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'mouse' }))

  it('opens after openDelay while the trigger is hovered', async () => {
    vi.useFakeTimers()
    const wrapper = mountHover()
    pointer('pointerenter')
    vi.advanceTimersByTime(699)
    await flushPromises()
    expect(wrapper.emitted('update:open')).toBeUndefined()

    vi.advanceTimersByTime(1)
    await flushPromises()
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('closes after closeDelay once the trigger lost focus', async () => {
    vi.useFakeTimers()
    const wrapper = mountHover()
    trigger().focus()
    vi.advanceTimersByTime(700)
    await flushPromises()
    trigger().blur()
    vi.advanceTimersByTime(299)
    await flushPromises()
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    vi.advanceTimersByTime(1)
    await flushPromises()
    expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
  })

  it('opens when the trigger gets focus', async () => {
    vi.useFakeTimers()
    const wrapper = mountHover()
    trigger().focus()
    vi.advanceTimersByTime(700)
    await flushPromises()

    expect(wrapper.emitted('update:open')).toEqual([[true]])
    expect(content()?.textContent).toContain('Hover content')
  })

  it('closes on Escape', async () => {
    const wrapper = mount(Popover, {
      props: { mode: 'hover', defaultOpen: true, title: 'Title' },
      slots: { default: () => h('button', 'Hover me'), content: () => h('p', 'Hover content') },
      attachTo: document.body,
    })

    await settle()
    escapeKeydown()
    await settle()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })
})

describe('OverlayProvider', () => {
  it('resolves open() once the overlay emitted after:leave', async () => {
    const overlay = useOverlay()

    mount(App, {
      props: { toaster: null },
      slots: { default: () => h('main', 'Page') },
      attachTo: document.body,
    })

    const order: string[] = []
    const modal = overlay.create(Modal, {
      props: { title: 'Saved', 'onAfter:leave': () => order.push('after:leave') },
    })

    const opened = modal.open()
    void opened.then(() => order.push('resolved'))
    await settle()
    escapeKeydown()
    await settle()

    expect(order).toEqual(['after:leave', 'resolved'])
    expect(modal.isMounted).toBe(false)
    overlay.overlays.splice(0)
  })
})
