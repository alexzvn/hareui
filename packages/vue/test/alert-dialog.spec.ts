import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import AlertDialog from '../src/components/alert-dialog/AlertDialog.vue'

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
})
