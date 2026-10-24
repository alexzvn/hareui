import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VNodeChild } from 'vue'
import { h, nextTick, ref } from 'vue'
import AlertDialog from '../src/components/alert-dialog/AlertDialog.vue'
import { expectAccessible } from './a11y'

function escapeKeydown() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
}

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
async function waitUnmount() {
  await nextTick()
  await nextTick()
  await nextTick()
}

// happy-dom has no CSS animations. Emulate them from the theme: a closed element whose classes declare a closed-state
// animation (the backdrop's exit, the dialog's `presence-hold`) reports a running one, so reka's Presence keeps it
// mounted (`unmountSuspended`) until `animationend`. The backdrop's exit is the shortest, so `finishExit` ends only that.
function stubExitAnimations() {
  const original = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const real = original(el, pseudo)
    const animatesClosed = el.getAttribute?.('data-state') === 'closed' && /\[data-state=closed\]\)\]:animate-(?!none)/.test(el.getAttribute('class') ?? '')
    if (!animatesClosed) return real
    return new Proxy(real, {
      get: (target, key) => key === 'animationName' ? 'exit' : Reflect.get(target, key),
    })
  })
}

async function finishExit() {
  await waitUnmount()
  const event = Object.assign(new Event('animationend', { bubbles: true }), { animationName: 'exit' })
  document.querySelectorAll('[data-slot=alert-dialog-backdrop][data-state=closed]').forEach(el => el.dispatchEvent(event))
  await waitUnmount()
}

const dialog = () => document.querySelector<HTMLElement>('[data-slot=alert-dialog-dialog]')

describe('alertDialog', () => {
  it('renders role="alertdialog" with the default danger icon', async () => {
    const wrapper = mount(AlertDialog, { props: { defaultOpen: true, title: 'Delete?' }, slots: { body: () => 'Body' } })
    await nextTick()
    expect(dialog()?.getAttribute('role')).toBe('alertdialog')
    const icon = document.querySelector('[data-slot=alert-dialog-icon]')
    expect(icon?.className).toContain('bg-danger-soft')
    expect(icon?.querySelector('[data-slot=alert-dialog-default-icon]')).not.toBeNull()
    wrapper.unmount()
  })

  it('escape does not close by default, but does with keyboardDismissible', async () => {
    const closed = mount(AlertDialog, { props: { defaultOpen: true }, slots: { body: () => 'Body' } })
    await nextTick()
    escapeKeydown()
    await waitUnmount()
    expect(dialog()).not.toBeNull()
    closed.unmount()
    await waitUnmount()

    const dismissible = mount(AlertDialog, { props: { defaultOpen: true, keyboardDismissible: true }, slots: { body: () => 'Body' } })
    await nextTick()
    escapeKeydown()
    await waitUnmount()
    expect(dialog()).toBeNull()
    dismissible.unmount()
  })

  it('footer close() closes the dialog', async () => {
    const wrapper = mount(AlertDialog, {
      props: { defaultOpen: true },
      slots: { footer: ({ close }: { close: () => void }) => h('button', { id: 'confirm', onClick: close }, 'Confirm') },
    })
    await nextTick()
    document.querySelector<HTMLButtonElement>('#confirm')!.click()
    await waitUnmount()
    expect(dialog()).toBeNull()
    wrapper.unmount()
  })

  it('names the dialog from `title` when #content replaces the whole content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(AlertDialog, {
      props: { defaultOpen: true, title: 'Custom content' },
      slots: { content: ({ close }: { close: () => void }) => h('button', { onClick: close }, 'Done') },
    })
    await nextTick()
    expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe('Custom content')
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('requires a `DialogTitle`'))
    wrapper.unmount()
    warn.mockRestore()
  })

  describe('page content behind the dialog (aria-hidden)', () => {
    beforeEach(() => stubExitAnimations())
    const mounted: Array<{ unmount: () => void }> = []
    // A failing assertion must not leave an open dialog behind for the next test.
    afterEach(() => {
      vi.restoreAllMocks()
      mounted.splice(0).forEach(w => w.unmount())
      document.body.innerHTML = ''
    })

    function mountControlled() {
      const open = ref(false)
      const wrapper = mount({
        render: () => h('div', [
          h('main', { id: 'page' }, 'Page content'),
          h(AlertDialog, { 'open': open.value, 'keyboardDismissible': true, 'onUpdate:open': (v: boolean) => (open.value = v) }, {
            body: () => 'Body',
            footer: ({ close }: { close: () => void }) => h('button', { id: 'confirm', onClick: close }, 'Confirm'),
          }),
        ]),
      }, { attachTo: document.body })
      mounted.push(wrapper)
      // The mount container is the sibling of the portalled dialog (the `#app` of a real page).
      const pageRoot = document.querySelector<HTMLElement>('#page')!.parentElement!.parentElement!
      return { open, wrapper, pageRoot }
    }

    // Each close path, repeated: the live repro leaves the page hidden from the 3rd cycle on.
    const closePaths: Array<[string, (open: { value: boolean }) => void]> = [
      ['Escape', () => escapeKeydown()],
      ['close button', () => document.querySelector<HTMLButtonElement>('[data-slot=alert-dialog-close-trigger]')!.click()],
      ['footer close()', () => document.querySelector<HTMLButtonElement>('#confirm')!.click()],
      ['controlled open=false', (open) => { open.value = false }],
    ]
    it.each(closePaths)('releases aria-hidden on the page after every open/close cycle closed with %s', async (_name, close) => {
      // behaviour-final-check H1
      const { open, wrapper, pageRoot } = mountControlled()
      for (let cycle = 1; cycle <= 4; cycle++) {
        open.value = true
        await nextTick()
        expect(pageRoot.getAttribute('aria-hidden'), `open, cycle ${cycle}`).toBe('true')
        close(open)
        await waitUnmount()
        // the container's exit animation must not run empty
        expect(dialog(), `mounted while exiting, cycle ${cycle}`).not.toBeNull()
        await finishExit()
        expect(open.value, `closed, cycle ${cycle}`).toBe(false)
        expect(dialog(), `unmounted, cycle ${cycle}`).toBeNull()
        expect(pageRoot.getAttribute('aria-hidden'), `aria-hidden after cycle ${cycle}`).toBeNull()
      }
    })
  })

  describe('accessibility', () => {
    const mounted: Array<{ unmount: () => void }> = []
    afterEach(() => {
      mounted.splice(0).forEach(w => w.unmount())
      document.body.innerHTML = ''
    })

    const closeTrigger = () => document.querySelector<HTMLButtonElement>('[data-slot=alert-dialog-close-trigger]')!
    const tab = (shiftKey = false) => (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true }))

    // `undefined` drops a default slot, so a test can check the dialog without it.
    type SlotFns = Partial<Record<string, (props: { close: () => void }) => VNodeChild>>

    function mountWithTrigger(props: Record<string, unknown> = {}, slots: SlotFns = {}) {
      const all: SlotFns = {
        default: () => h('button', { id: 'trigger' }, 'Delete project'),
        body: () => h('p', 'This permanently deletes the project.'),
        footer: ({ close }) => [h('button', { id: 'cancel', onClick: close }, 'Cancel'), h('button', { id: 'confirm', onClick: close }, 'Delete')],
        ...slots,
      }
      const wrapper = mount(AlertDialog, {
        props: { title: 'Delete project?', ...props },
        slots: Object.fromEntries(Object.entries(all).filter(([, fn]) => fn)),
        attachTo: document.body,
      })
      mounted.push(wrapper)
      const trigger = document.querySelector<HTMLButtonElement>('#trigger')!
      return { wrapper, trigger }
    }

    async function openWith(trigger: HTMLButtonElement) {
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
      ['a title, default icon, body and footer', {}, {}],
      ['status="success"', { status: 'success' }, {}],
      ['a custom #header and a `title`', {}, { header: () => h('h2', 'Delete project?') }],
      ['#content replacing the whole content', {}, { content: () => h('button', 'Done') }],
      ['no icon and no close button', { icon: false, closeButton: false }, {}],
      ['keyboardDismissible and dismissible', { keyboardDismissible: true, dismissible: true }, {}],
    ]
    it.each(variants)('has no axe violations open with %s', async (_name, props, slots) => {
      const { trigger } = mountWithTrigger(props, slots)
      await openWith(trigger)
      expect(dialog()).not.toBeNull()
      await expectAccessible()
    })

    it('the trigger reflects the open state and controls the alert dialog', async () => {
      const { trigger } = mountWithTrigger()
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      await openWith(trigger)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(dialog()!.id)
    })

    it('names the alert dialog from its visible heading and hides the decorative icon', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      const heading = document.getElementById(dialog()!.getAttribute('aria-labelledby')!)!
      expect(heading.getAttribute('data-slot')).toBe('alert-dialog-heading')
      expect(heading.textContent?.trim()).toBe('Delete project?')
      expect(dialog()!.hasAttribute('aria-describedby')).toBe(false)
      expect(document.querySelector('[data-slot=alert-dialog-default-icon]')!.getAttribute('aria-hidden')).toBe('true')
    })

    it('names the alert dialog from `title` when #header replaces the visible heading', async () => {
      const { trigger } = mountWithTrigger({}, { header: () => h('div', 'Custom') })
      await openWith(trigger)
      expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe('Delete project?')
    })

    it('the default close button is named "Close"', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      expect(closeTrigger().tagName).toBe('BUTTON')
      expect(closeTrigger().getAttribute('aria-label')).toBe('Close')
    })

    it('focuses the dialog on open and traps Tab / Shift+Tab inside it', async () => {
      const { trigger } = mountWithTrigger()
      await openWith(trigger)
      expect(document.activeElement).toBe(dialog())
      const seen: Array<string | null> = []
      for (let i = 0; i < 4; i++) {
        tab()
        seen.push((document.activeElement as HTMLElement).id || (document.activeElement as HTMLElement).dataset.slot!)
      }
      expect(seen).toEqual(['alert-dialog-close-trigger', 'cancel', 'confirm', 'alert-dialog-close-trigger'])
      tab(true)
      expect(document.activeElement?.id).toBe('confirm')
    })

    it('returns focus to the trigger after Escape (keyboardDismissible), the close button or a footer action', async () => {
      const { trigger } = mountWithTrigger({ keyboardDismissible: true })
      const closes: Array<() => void> = [
        () => escapeKeydown(),
        () => closeTrigger().click(),
        () => document.querySelector<HTMLButtonElement>('#confirm')!.click(),
      ]
      for (const close of closes) {
        await openWith(trigger)
        expect(dialog()).not.toBeNull()
        close()
        await waitUnmount()
        expect(dialog()).toBeNull()
        expect(document.activeElement).toBe(trigger)
      }
    })

    it('keeps focus inside the alert dialog when focus moves to the page behind it', async () => {
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
