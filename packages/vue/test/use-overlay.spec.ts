import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h } from 'vue'

import AlertDialog from '@/components/alert-dialog/AlertDialog.vue'
import App from '@/components/app/App.vue'
import Button from '@/components/button/Button.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'
import Popover from '@/components/popover/Popover.vue'
import { useOverlay } from '@/composables/useOverlay'

const overlay = useOverlay()

const escapeKeydown = () => {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  )
}

// Reka's Presence needs a few ticks to drop a closed node; the provider then unmounts the overlay.
const settle = async () => {
  for (let i = 0; i < 5; i++) await flushPromises()
}

const dialogs = () => [
  ...document.querySelectorAll<HTMLElement>('[role=dialog], [role=alertdialog]'),
]

const dialogText = () => dialogs().map((dialog) => dialog.textContent?.trim() ?? '')

const clickButton = async (name: string) => {
  const button = [...document.querySelectorAll('button')].find((el) => el.textContent === name)
  button?.click()
  await settle()
}

const mountApp = (props: Record<string, unknown> = {}) => {
  return mount(App, {
    props: { toaster: null, ...props },
    slots: { default: () => h('main', 'Page') },
    attachTo: document.body,
  })
}

/** A wrapper overlay that reports a value through its `close` event, as user overlay components do. */
const ConfirmModal = defineComponent({
  props: { title: { type: String, default: 'Confirm' }, message: { type: String, default: '' } },
  emits: { close: (value: boolean) => typeof value === 'boolean' },
  setup(props, { emit }) {
    return () =>
      h(
        Modal,
        { title: props.title },
        {
          body: () => h('p', props.message),
          footer: () => [
            h(Button, { onClick: () => emit('close', false) }, () => 'Cancel'),
            h(Button, { onClick: () => emit('close', true) }, () => 'Confirm'),
          ],
        },
      )
  },
})

enableAutoUnmount(afterEach)

afterEach(async () => {
  vi.unstubAllGlobals()
  overlay.closeAll()
  await settle()
  overlay.overlays.splice(0)
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('useOverlay', () => {
  it('renders nothing until an overlay is opened', async () => {
    mountApp()
    const modal = overlay.create(Modal, { props: { title: 'Invite sent' } })
    await settle()

    expect(dialogs()).toHaveLength(0)
    expect(modal.isOpen).toBe(false)
    expect(modal.isMounted).toBe(false)
    expect(overlay.overlays).toHaveLength(1)

    modal.open()
    await settle()

    expect(dialogText()).toEqual([expect.stringContaining('Invite sent')])
    expect(modal.isOpen).toBe(true)
    expect(overlay.isOpen(modal.id)).toBe(true)
  })

  it('opens at once with defaultOpen', async () => {
    mountApp()
    overlay.create(Modal, { props: { title: 'Welcome back' }, defaultOpen: true })
    await settle()

    expect(dialogText()).toEqual([expect.stringContaining('Welcome back')])
  })

  it('registers nothing during server rendering, so requests share no overlays', () => {
    vi.stubGlobal('window', undefined)
    const modal = overlay.create(Modal, { props: { title: 'Server' }, defaultOpen: true })

    expect(overlay.overlays).toHaveLength(0)
    expect(modal.isOpen).toBe(true)
  })

  it('merges open() props over the created props', async () => {
    mountApp()

    const modal = overlay.create(ConfirmModal, {
      props: { title: 'Archive', message: 'Archive it?' },
    })

    modal.open({ title: 'Delete' })
    await settle()

    expect(dialogText()[0]).toContain('Delete')
    expect(dialogText()[0]).toContain('Archive it?')
  })

  it('starts from the created props on every open', async () => {
    mountApp()

    const modal = overlay.create(ConfirmModal, {
      props: { title: 'Archive', message: 'Archive it?' },
    })

    modal.open({ title: 'Delete' })
    await settle()
    modal.close()
    await settle()
    modal.open()
    await settle()
    expect(dialogText()[0]).toContain('Archive')
  })

  it('resolves open() with the payload of the close event', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    const opened = modal.open({ message: 'Publish the draft?' })
    await settle()
    await clickButton('Confirm')

    await expect(opened).resolves.toBe(true)
    expect(opened.result).toBe(opened)
    expect(opened.id).toBe(modal.id)
  })

  it('unmounts the overlay once its close event closes it', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    modal.open({ message: 'Publish the draft?' })
    await settle()
    await clickButton('Confirm')
    await settle()

    expect(dialogs()).toHaveLength(0)
    expect(modal.isMounted).toBe(false)
  })

  it('resolves open() with undefined when the overlay is dismissed', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    const opened = modal.open()
    await settle()
    escapeKeydown()
    await settle()

    await expect(opened).resolves.toBeUndefined()
    expect(modal.isOpen).toBe(false)
    expect(dialogs()).toHaveLength(0)
  })

  it('close(value) closes the overlay and resolves every pending open() with the value', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    const first = modal.open()
    const second = modal.open()
    await settle()
    modal.close(false)
    await settle()

    await expect(first).resolves.toBe(false)
    await expect(second).resolves.toBe(false)
    expect(dialogs()).toHaveLength(0)
  })

  it('patch() updates the props of an open overlay', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal, { props: { title: 'Uploading' } })

    modal.open()
    await settle()
    modal.patch({ title: 'Upload complete' })
    await settle()

    expect(dialogText()[0]).toContain('Upload complete')
  })

  it('open(id, props) opens that overlay with the props', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    overlay.open(modal.id, { title: 'By id' })
    await settle()

    expect(dialogText()[0]).toContain('By id')
  })

  it('patch(id, props) updates that open overlay', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    modal.open()
    await settle()
    overlay.patch(modal.id, { title: 'Patched by id' })
    await settle()

    expect(dialogText()[0]).toContain('Patched by id')
  })

  it('close(id, value) closes that overlay and resolves its open() with the value', async () => {
    mountApp()
    const modal = overlay.create(ConfirmModal)

    const opened = modal.open()
    await settle()
    overlay.close(modal.id, true)
    await settle()

    await expect(opened).resolves.toBe(true)
    expect(overlay.isOpen(modal.id)).toBe(false)
  })

  it('closeAll() closes every open overlay', async () => {
    mountApp()
    const first = overlay.create(Modal, { props: { title: 'First' } })
    const second = overlay.create(Drawer, { props: { title: 'Second' } })

    const opened = first.open()
    second.open()
    await settle()
    expect(dialogs()).toHaveLength(2)

    overlay.closeAll()
    await settle()

    await expect(opened).resolves.toBeUndefined()
    expect(dialogs()).toHaveLength(0)
  })

  it('keeps a closed overlay registered, and drops it after closing with destroyOnClose', async () => {
    mountApp()
    const kept = overlay.create(Modal)
    const destroyed = overlay.create(Modal, { destroyOnClose: true })

    kept.open()
    destroyed.open()
    await settle()
    overlay.closeAll()
    await settle()

    expect(overlay.overlays.map((item) => item.id)).toEqual([kept.id])
    expect(() => destroyed.open()).toThrow('useOverlay: overlay not found')
  })

  it('unmount() stops rendering an open overlay at once', async () => {
    mountApp()
    const modal = overlay.create(Modal, { props: { title: 'Gone' } })

    modal.open()
    await settle()
    modal.unmount()
    await settle()

    expect(modal.isMounted).toBe(false)
    expect(dialogs()).toHaveLength(0)
  })

  it.each<[string, Component, Record<string, unknown>]>([
    ['Modal', Modal, {}],
    ['Drawer', Drawer, {}],
    ['AlertDialog', AlertDialog, { keyboardDismissible: true }],
    ['Popover', Popover, {}],
  ])('opens a %s and closes it on Escape', async (_, component, props) => {
    mountApp()
    const instance = overlay.create(component, { props: { title: 'Session expiring', ...props } })

    const opened = instance.open()
    await settle()
    expect(dialogText().join(' ')).toContain('Session expiring')

    escapeKeydown()
    await settle()

    await expect(opened).resolves.toBeUndefined()
    expect(dialogs()).toHaveLength(0)
  })

  it('renders a component without a close event without warnings', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountApp()

    overlay.create(Modal, { props: { title: 'Plain' } }).open()
    await settle()

    expect(warn).not.toHaveBeenCalled()
  })

  it('renders each overlay once when apps are nested', async () => {
    const Nested = defineComponent({
      setup: () => () => h(App, { toaster: null }, () => h(App, { toaster: null }, () => 'Inner')),
    })

    mount(Nested, { attachTo: document.body })
    overlay.create(Modal, { props: { title: 'Only once' } }).open()
    await settle()

    expect(dialogs()).toHaveLength(1)
  })

  it('waits for the exit animation of a component without lifecycle events', async () => {
    let finish = () => {}
    const finished = new Promise<void>((resolve) => (finish = resolve))

    const Panel = defineComponent({
      props: { open: Boolean },
      setup: (props) => () =>
        h('div', { 'data-slot': 'panel', 'data-state': props.open ? 'open' : 'closed' }, 'Panel'),
    })

    const exitAnimation = () => {
      const target = document.querySelector('[data-slot=panel][data-state=closed]')
      if (!target) return []

      return [{ effect: { target, getComputedTiming: () => ({ endTime: 200 }) }, finished }]
    }

    Object.defineProperty(document, 'getAnimations', { value: exitAnimation, configurable: true })

    mountApp()
    const panel = overlay.create(Panel)

    void panel.open()
    await settle()
    panel.close()
    await settle()

    expect(panel.isOpen).toBe(false)
    expect(panel.isMounted).toBe(true)
    expect(document.querySelector('[data-slot=panel]')).not.toBeNull()

    finish()
    await settle()

    expect(panel.isMounted).toBe(false)
    expect(document.querySelector('[data-slot=panel]')).toBeNull()

    Reflect.deleteProperty(document, 'getAnimations')
  })
})
