import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component, VNodeChild } from 'vue'
import { h, nextTick, ref } from 'vue'

import AlertDialog from '@/components/alert-dialog/AlertDialog.vue'
import Drawer from '@/components/drawer/Drawer.vue'
import Modal from '@/components/modal/Modal.vue'

// The lifecycle `useDialogShell` gives Modal, Drawer and AlertDialog, checked through each of them.

const escapeKeydown = () => {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  )
}

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
const waitUnmount = async () => {
  await nextTick()
  await nextTick()
  await nextTick()
}

// happy-dom has no CSS animations: report a running one for closed elements whose theme declares a closed-state
// animation, so the dialog stays mounted through its exit until `finishExit` (see modal.spec.ts).
const stubExitAnimations = () => {
  const original = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const real = original(el, pseudo)
    const animatesClosed =
      el.getAttribute?.('data-state') === 'closed' &&
      /\[data-state=closed\]\)\]:animate-(?!none)/.test(el.getAttribute('class') ?? '')
    if (!animatesClosed) return real
    return new Proxy(real, {
      get: (target, key) => (key === 'animationName' ? 'exit' : Reflect.get(target, key)),
    })
  })
}

type DialogCase = {
  name: string
  component: Component
  /** `data-slot` prefix of the component's parts. */
  slot: string
  /** Props under which Escape closes the dialog. */
  escapeOn: Record<string, unknown>
  /** Props under which Escape is ignored. */
  escapeOff: Record<string, unknown>
}

const cases: DialogCase[] = [
  // Modal: one `dismissible` switch for the backdrop and Escape (default on).
  {
    name: 'Modal',
    component: Modal,
    slot: 'modal',
    escapeOn: {},
    escapeOff: { dismissible: false },
  },
  // Drawer: Escape follows `keyboardDismissible`, independent of the backdrop's `dismissible`.
  {
    name: 'Drawer',
    component: Drawer,
    slot: 'drawer',
    escapeOn: { dismissible: false },
    escapeOff: { keyboardDismissible: false },
  },
  // AlertDialog: Escape is off by default (HeroUI's `isKeyboardDismissDisabled`), on with `keyboardDismissible`.
  {
    name: 'AlertDialog',
    component: AlertDialog,
    slot: 'alert-dialog',
    escapeOn: { keyboardDismissible: true },
    escapeOff: {},
  },
]

const mounted: Array<{ unmount: () => void }> = []

beforeEach(() => stubExitAnimations())
// A failing assertion must not leave an open dialog behind for the next test.
afterEach(() => {
  vi.restoreAllMocks()
  mounted.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
})

describe.each(cases)('dialog shell: $name', ({ component, slot, escapeOn, escapeOff }) => {
  const dialog = () => document.querySelector<HTMLElement>(`[data-slot=${slot}-dialog]`)

  const finishExit = async () => {
    await waitUnmount()
    const event = Object.assign(new Event('animationend', { bubbles: true }), {
      animationName: 'exit',
    })
    document
      .querySelectorAll(`[data-slot=${slot}-backdrop][data-state=closed]`)
      .forEach((el) => el.dispatchEvent(event))
    await waitUnmount()
  }

  /** Mounts the dialog beside a page, controlled by `open`. `onUpdate` replaces the default `v-model` write-back. */
  const mountDialog = (
    props: Record<string, unknown> = {},
    { initial = false, onUpdate }: { initial?: boolean; onUpdate?: (value: boolean) => void } = {},
  ) => {
    const open = ref(initial)
    const wrapper = mount(
      {
        render: () =>
          h('div', [
            h('main', { id: 'page' }, [h('button', { id: 'outside' }, 'Outside')]),
            h(
              component,
              {
                ...props,
                open: open.value,
                'onUpdate:open': onUpdate ?? ((value: boolean) => (open.value = value)),
              },
              { body: () => 'Content' },
            ),
          ]),
      },
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    // The mount container is the sibling of the portalled dialog (the `#app` of a real page).
    const pageRoot = document.querySelector<HTMLElement>('#page')!.parentElement!.parentElement!
    return { open, pageRoot }
  }

  it('makes the page outside the dialog inert while open and releases it after close', async () => {
    const { open, pageRoot } = mountDialog()
    expect(pageRoot.hasAttribute('inert')).toBe(false)

    open.value = true
    await nextTick()
    expect(dialog()).not.toBeNull()
    expect(pageRoot.hasAttribute('inert')).toBe(true)
    // The dialog's own subtree stays interactive.
    expect(dialog()!.closest('[inert]')).toBeNull()

    open.value = false
    await finishExit()
    expect(dialog()).toBeNull()
    expect(pageRoot.hasAttribute('inert')).toBe(false)
  })

  it('mirrors a controlled `open` change in the same flush, before the exit animation ends', async () => {
    const { open, pageRoot } = mountDialog()
    open.value = true
    await nextTick()
    expect(pageRoot.hasAttribute('inert')).toBe(true)

    open.value = false
    await nextTick()
    // Still mounted for its exit animation, but already closed: the page is usable again at once.
    expect(dialog()).not.toBeNull()
    expect(pageRoot.hasAttribute('inert')).toBe(false)

    open.value = true
    await nextTick()
    await nextTick()
    expect(pageRoot.hasAttribute('inert')).toBe(true)
  })

  it('Escape closes the dialog when keyboard dismissal is on', async () => {
    const { open, pageRoot } = mountDialog(escapeOn)
    open.value = true
    await nextTick()
    await nextTick()

    escapeKeydown()
    await nextTick()
    expect(open.value).toBe(false)
    expect(pageRoot.hasAttribute('inert')).toBe(false)
    await finishExit()
    expect(dialog()).toBeNull()
  })

  it('Escape leaves the dialog open when keyboard dismissal is off', async () => {
    const { open, pageRoot } = mountDialog(escapeOff)
    open.value = true
    await nextTick()
    await nextTick()

    escapeKeydown()
    await waitUnmount()
    expect(open.value).toBe(true)
    expect(dialog()).not.toBeNull()
    expect(pageRoot.hasAttribute('inert')).toBe(true)
  })

  it('stays open and keeps the page inert while a controlled parent refuses to close', async () => {
    const updates: boolean[] = []
    const { pageRoot } = mountDialog(escapeOn, {
      initial: true,
      onUpdate: (value) => updates.push(value),
    })
    await nextTick()
    expect(pageRoot.hasAttribute('inert')).toBe(true)

    escapeKeydown()
    await waitUnmount()
    expect(updates).toEqual([false])
    expect(dialog()).not.toBeNull()
    expect(pageRoot.hasAttribute('inert')).toBe(true)
  })

  it('focuses the dialog element itself on open', async () => {
    const { open } = mountDialog()
    open.value = true
    await nextTick()
    await nextTick()
    expect(dialog()).not.toBeNull()
    expect(document.activeElement).toBe(dialog())
  })
})

describe('dialog shell: header', () => {
  type Slots = Record<string, () => VNodeChild>
  const headerCases: Array<[string, Component, string, Record<string, unknown>, Slots, boolean]> = [
    ['Modal without title or header parts', Modal, 'modal', {}, {}, false],
    [
      'Modal with only a #description',
      Modal,
      'modal',
      {},
      { description: () => h('p', 'Details') },
      true,
    ],
    ['Modal with only an #icon', Modal, 'modal', {}, { icon: () => h('span', '!') }, true],
    ['Drawer without title', Drawer, 'drawer', {}, {}, false],
    ['Drawer with a title', Drawer, 'drawer', { title: 'Settings' }, {}, true],
    ['AlertDialog with only its default status icon', AlertDialog, 'alert-dialog', {}, {}, true],
    ['AlertDialog without icon or title', AlertDialog, 'alert-dialog', { icon: false }, {}, false],
    [
      'AlertDialog with a #title slot and no icon',
      AlertDialog,
      'alert-dialog',
      { icon: false },
      { title: () => 'Delete?' },
      true,
    ],
  ]

  it.each(headerCases)('%s', async (_name, component, slot, props, slots, rendered) => {
    mounted.push(
      mount({
        render: () =>
          h(component, { defaultOpen: true, ...props }, { body: () => 'Content', ...slots }),
      }),
    )
    await nextTick()
    expect(document.querySelector(`[data-slot=${slot}-dialog]`)).not.toBeNull()
    expect(!!document.querySelector(`[data-slot=${slot}-header]`)).toBe(rendered)
  })

  const headerSlotCases: Array<[string, Component, string]> = [
    ['Modal', Modal, 'modal'],
    ['Drawer', Drawer, 'drawer'],
    ['AlertDialog', AlertDialog, 'alert-dialog'],
  ]
  it.each(headerSlotCases)(
    '%s: a #header slot replaces the visible heading, the title stays as the accessible name',
    async (_name, component, slot) => {
      mounted.push(
        mount({
          render: () =>
            h(
              component,
              { defaultOpen: true, title: 'Settings' },
              { header: () => h('span', { id: 'custom' }, 'Custom') },
            ),
        }),
      )
      await nextTick()
      expect(document.querySelector(`[data-slot=${slot}-header] #custom`)).not.toBeNull()
      expect(document.querySelector(`[data-slot=${slot}-heading]`)).toBeNull()
      const dialog = document.querySelector<HTMLElement>(`[data-slot=${slot}-dialog]`)!
      const labelledBy = dialog.getAttribute('aria-labelledby')!
      expect(document.getElementById(labelledBy)?.textContent).toBe('Settings')
    },
  )
})
