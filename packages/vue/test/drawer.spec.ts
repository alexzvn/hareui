import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Drawer from '../src/components/drawer/Drawer.vue'

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
async function waitUnmount() {
  await nextTick()
  await nextTick()
  await nextTick()
}

const dialog = () => document.querySelector<HTMLElement>('[data-slot=drawer-dialog]')

function pointer(type: string, el: Element, clientY: number) {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, clientY, pointerId: 1 }))
}

function drag(el: HTMLElement, distance: number) {
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
    const bottom = mount(Drawer, { props: { defaultOpen: true, handle: true, title: 'T' }, slots: { footer: () => 'F' } })
    await nextTick()
    let order = [...dialog()!.children].map(c => c.getAttribute('data-slot'))
    expect(order.indexOf('drawer-handle')).toBeLessThan(order.indexOf('drawer-header'))
    bottom.unmount()
    await waitUnmount()

    const top = mount(Drawer, { props: { defaultOpen: true, handle: true, placement: 'top', title: 'T' }, slots: { footer: () => 'F' } })
    await nextTick()
    order = [...dialog()!.children].map(c => c.getAttribute('data-slot'))
    expect(order.at(-1)).toBe('drawer-handle')
    top.unmount()
  })

  it('names the dialog from `title` when #content replaces the whole content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Drawer, {
      props: { defaultOpen: true, title: 'Custom content' },
      slots: { content: ({ close }: { close: () => void }) => h('button', { onClick: close }, 'Done') },
    })
    await nextTick()
    expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe('Custom content')
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('requires a `DialogTitle`'))
    wrapper.unmount()
    warn.mockRestore()
  })

  it('a short drag springs back, a long drag towards the edge closes', async () => {
    const wrapper = mount(Drawer, { props: { defaultOpen: true, title: 'T' }, attachTo: document.body })
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
    }
    finally {
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
    }
    finally {
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
    const tab = () => (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
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
})
