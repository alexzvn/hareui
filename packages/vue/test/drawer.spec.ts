import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VNodeChild } from 'vue'
import { h, nextTick } from 'vue'

import Drawer from '@/components/drawer/Drawer.vue'

import { expectAccessible } from './a11y'

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
const waitUnmount = async () => {
  await nextTick()
  await nextTick()
  await nextTick()
}

const dialog = () => document.querySelector<HTMLElement>('[data-slot=drawer-dialog]')

const pointer = (type: string, el: Element, clientY: number) => {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, clientY, pointerId: 1 }))
}

const drag = (el: HTMLElement, distance: number) => {
  // happy-dom/jsdom lack pointer capture; drag logic only needs it not to throw.
  el.setPointerCapture ??= () => {}
  el.releasePointerCapture ??= () => {}
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: 400 })
  const header = el.querySelector('[data-slot=drawer-header]')!
  pointer('pointerdown', header, 100)
  pointer('pointermove', header, 100 + distance)
  pointer('pointerup', header, 100 + distance)
}

describe('drawer', () => {
  it('renders the handle at the top, or after the footer for placement="top"', async () => {
    const bottom = mount(Drawer, {
      props: { defaultOpen: true, handle: true, title: 'T' },
      slots: { footer: () => 'F' },
    })
    await nextTick()
    let order = [...dialog()!.children].map((c) => c.getAttribute('data-slot'))
    expect(order.indexOf('drawer-handle')).toBeLessThan(order.indexOf('drawer-header'))
    bottom.unmount()
    await waitUnmount()

    const top = mount(Drawer, {
      props: { defaultOpen: true, handle: true, placement: 'top', title: 'T' },
      slots: { footer: () => 'F' },
    })
    await nextTick()
    order = [...dialog()!.children].map((c) => c.getAttribute('data-slot'))
    expect(order.at(-1)).toBe('drawer-handle')
    top.unmount()
  })

  it('names the dialog from `title` when #content replaces the whole content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Drawer, {
      props: { defaultOpen: true, title: 'Custom content' },
      slots: {
        content: ({ close }: { close: () => void }) => h('button', { onClick: close }, 'Done'),
      },
    })
    await nextTick()
    expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Custom content',
    )
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('requires a `DialogTitle`'))
    wrapper.unmount()
    warn.mockRestore()
  })

  it('a short drag springs back, a long drag towards the edge closes', async () => {
    const wrapper = mount(Drawer, {
      props: { defaultOpen: true, title: 'T' },
      attachTo: document.body,
    })
    await nextTick()
    // The velocity check uses Date.now(); freeze time so only distance decides. The frozen value
    // must be later than mount: Vue's event invoker drops events stamped before the listener was attached.
    const now = Date.now
    const frozen = now() + 10_000
    Date.now = () => frozen
    try {
      drag(dialog()!, 40)
      await waitUnmount()
      expect(dialog()).not.toBeNull()
      expect(dialog()!.style.transform).toBe('')

      drag(dialog()!, 200)
      await waitUnmount()
      expect(dialog()).toBeNull()
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    } finally {
      Date.now = now
      wrapper.unmount()
    }
  })

  it('does not drag-dismiss when dismissible is false', async () => {
    const wrapper = mount(Drawer, { props: { defaultOpen: true, dismissible: false, title: 'T' } })
    await nextTick()
    const now = Date.now
    const frozen = now() + 10_000
    Date.now = () => frozen
    try {
      drag(dialog()!, 300)
      await waitUnmount()
      expect(dialog()).not.toBeNull()
    } finally {
      Date.now = now
      wrapper.unmount()
    }
  })

  it('Tab skips a scrollable body, like React Aria', async () => {
    // behaviour-final-check D2
    const wrapper = mount(Drawer, {
      props: { defaultOpen: true, title: 'Settings' },
      slots: {
        body: () => h('div', { style: 'overflow:auto;max-height:40px' }, [h('p', 'Long text')]),
        footer: () => [h('button', 'Cancel'), h('button', 'Done')],
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const tab = () =>
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      )
    const name = () => {
      const el = document.activeElement as HTMLElement
      return el.dataset.slot ?? el.textContent
    }
    const seen: Array<string | null> = []
    for (let i = 0; i < 4; i++) {
      tab()
      seen.push(name())
    }
    expect(seen).toEqual(['drawer-close-trigger', 'Cancel', 'Done', 'drawer-close-trigger'])
    wrapper.unmount()
  })

  describe('accessibility', () => {
    const mounted: Array<{ unmount: () => void }> = []
    afterEach(() => {
      mounted.splice(0).forEach((w) => w.unmount())
      document.body.innerHTML = ''
    })

    const escapeKeydown = () =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    const closeTrigger = () =>
      document.querySelector<HTMLButtonElement>('[data-slot=drawer-close-trigger]')!

    // `undefined` drops a default slot, so a test can check the drawer without it.
    type SlotFns = Partial<Record<string, (props: { close: () => void }) => VNodeChild>>

    const mountWithTrigger = (props: Record<string, unknown> = {}, slots: SlotFns = {}) => {
      const all: SlotFns = {
        default: () => h('button', { id: 'trigger' }, 'Open'),
        body: () => h('label', ['Name', h('input', { type: 'text' })]),
        footer: () => [h('button', 'Cancel'), h('button', 'Save')],
        ...slots,
      }
      const wrapper = mount(Drawer, {
        props: { title: 'Settings', handle: true, ...props },
        slots: Object.fromEntries(Object.entries(all).filter(([, fn]) => fn)),
        attachTo: document.body,
      })
      mounted.push(wrapper)
      const trigger = document.querySelector<HTMLButtonElement>('#trigger')!
      return { wrapper, trigger }
    }

    const openWith = async (trigger: HTMLButtonElement) => {
      trigger.focus()
      trigger.click()
      await nextTick()
      await nextTick()
    }

    it('has no axe violations closed, with the trigger only', async () => {
      const { wrapper } = mountWithTrigger()
      await expectAccessible(wrapper)
    })

    const variants: Array<[string, Record<string, unknown>, SlotFns]> = [
      ['a title, handle, body and footer', {}, {}],
      ['a custom #header and a `title`', {}, { header: () => h('h2', 'Settings') }],
      ['#content replacing the whole content', {}, { content: () => h('button', 'Done') }],
      ['placement="left" and no close button', { placement: 'left', closeButton: false }, {}],
      ['placement="top" (handle after the footer)', { placement: 'top' }, {}],
      [
        'dismissible=false and keyboardDismissible=false',
        { dismissible: false, keyboardDismissible: false },
        {},
      ],
    ]
    it.each(variants)('has no axe violations open with %s', async (_name, props, slots) => {
      const { trigger } = mountWithTrigger(props, slots)
      await openWith(trigger)
      expect(dialog()).not.toBeNull()
      await expectAccessible()
    })

    it('renders role="dialog" and the trigger reflects the open state', async () => {
      const { trigger } = mountWithTrigger()
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      await openWith(trigger)
      expect(dialog()!.getAttribute('role')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(dialog()!.id)
    })

    it('names the dialog from its visible heading, with no dangling aria-describedby', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      const heading = document.getElementById(dialog()!.getAttribute('aria-labelledby')!)!
      expect(heading.getAttribute('data-slot')).toBe('drawer-heading')
      expect(heading.textContent?.trim()).toBe('Settings')
      expect(dialog()!.hasAttribute('aria-describedby')).toBe(false)
    })

    it('names the dialog from `title` when #header replaces the visible heading', async () => {
      const { trigger } = mountWithTrigger({}, { header: () => h('div', 'Custom') })
      await openWith(trigger)
      expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Settings',
      )
    })

    it('hides the decorative handle and names the close button "Close"', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      expect(document.querySelector('[data-slot=drawer-handle]')!.getAttribute('aria-hidden')).toBe(
        'true',
      )
      expect(closeTrigger().tagName).toBe('BUTTON')
      expect(closeTrigger().getAttribute('aria-label')).toBe('Close')
    })

    it('focuses the dialog on open and returns focus to the trigger on Escape', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      expect(document.activeElement).toBe(dialog())
      expect(dialog()!.tabIndex).toBe(-1)

      escapeKeydown()
      await waitUnmount()
      expect(dialog()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('keyboardDismissible=false keeps the drawer open on Escape', async () => {
      const { trigger } = mountWithTrigger({ keyboardDismissible: false })
      await openWith(trigger)
      escapeKeydown()
      await waitUnmount()
      expect(dialog()).not.toBeNull()
    })

    it('returns focus to the trigger when closed with the close button', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      closeTrigger().focus()
      closeTrigger().click()
      await waitUnmount()
      expect(dialog()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('Shift+Tab wraps from the first tabbable to the last', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      closeTrigger().focus()
      closeTrigger().dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(document.activeElement?.textContent).toBe('Save')
    })

    it('keeps focus inside the drawer when focus moves to the page behind it', async () => {
      const outside = document.createElement('button')
      outside.textContent = 'Outside'
      document.body.prepend(outside)
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      outside.focus()
      await nextTick()
      expect(dialog()!.contains(document.activeElement)).toBe(true)
    })
  })
})
