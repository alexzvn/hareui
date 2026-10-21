import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Modal from '../src/components/modal/Modal.vue'

function escapeKeydown() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
}

// reka-ui's Presence defers unmounting a closed node until it re-checks
// `getComputedStyle(...).animationName` on the tick after the `present` prop
// flips, which itself happens a tick after the watcher's own internal
// `await nextTick()` - three ticks in total before the dialog leaves the DOM.
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
  document.querySelectorAll('[data-slot=modal-backdrop][data-state=closed]').forEach(el => el.dispatchEvent(event))
  await waitUnmount()
}

describe('modal', () => {
  // Container enter/exit animations (theme and user `data-[state=…]:` classes) depend on this attribute.
  it('container mirrors the open state for animations', async () => {
    const open = ref(true)
    const wrapper = mount({ render: () => h(Modal, { 'open': open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, { body: () => 'Content' }) })
    await nextTick()
    const container = () => document.querySelector<HTMLElement>('[data-slot=modal-container]')
    expect(container()?.dataset.state).toBe('open')

    open.value = false
    await nextTick()
    // Presence keeps it mounted until the exit animation check; it must already be marked closed.
    expect(container()?.dataset.state).toBe('closed')

    wrapper.unmount()
  })

  it('trigger opens the dialog', async () => {
    const wrapper = mount(Modal, {
      slots: { default: () => h('button', 'Open'), body: () => 'Content' },
    })
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    wrapper.unmount()
  })

  it('Escape closes the dialog', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true },
      slots: { body: () => 'Content' },
    })
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await waitUnmount()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    wrapper.unmount()
  })

  it('dismissible=false keeps the dialog open on Escape', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, dismissible: false },
      slots: { body: () => 'Content' },
    })
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    wrapper.unmount()
  })

  it('v-model:open stays in sync with external state in both directions', async () => {
    const open = ref(false)
    const Wrapper = {
      setup() {
        return () => h(Modal, {
          open: open.value,
          'onUpdate:open': (value: boolean) => { open.value = value },
        }, { body: () => 'Content' })
      },
    }
    const wrapper = mount(Wrapper)
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    open.value = true
    await nextTick()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()

    escapeKeydown()
    await nextTick()
    expect(open.value).toBe(false)
    await waitUnmount()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    wrapper.unmount()
  })

  // The theme spaces sections with `header + body` / `body + footer` sibling selectors; the
  // visually hidden title rendered for a custom #header must not sit between them.
  it('keeps header, body and footer adjacent when the #header slot replaces the title', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true },
      slots: { header: () => h('h2', 'Contact Us'), body: () => 'Content', footer: () => 'Actions' },
    })
    await nextTick()
    const body = document.querySelector('[data-slot=modal-body]')!
    expect(body.previousElementSibling?.getAttribute('data-slot')).toBe('modal-header')
    expect(body.nextElementSibling?.getAttribute('data-slot')).toBe('modal-footer')
    expect(document.querySelector('[role=dialog]')?.getAttribute('aria-labelledby')).toBeTruthy()

    wrapper.unmount()
  })

  it('names the dialog from `title` when #header replaces the visible heading', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, title: 'Contact Us' },
      slots: { header: () => h('div', 'Custom'), body: () => 'Content' },
    })
    await nextTick()
    const dialog = document.querySelector('[role=dialog]')!
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Contact Us')

    wrapper.unmount()
  })

  it('names the dialog from `title` when #content replaces the whole content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, title: 'Custom content' },
      slots: { content: ({ close }: { close: () => void }) => h('button', { onClick: close }, 'Done') },
    })
    await nextTick()
    const dialog = document.querySelector('[role=dialog]')!
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Custom content')
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('requires a `DialogTitle`'))

    wrapper.unmount()
    warn.mockRestore()
  })

  it('#description renders after the title and describes the dialog', async () => {
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, title: 'Contact Us' },
      slots: { description: () => h('p', { class: 'text-muted' }, 'Fill out the form'), body: () => 'Content' },
    })
    await nextTick()
    const dialog = document.querySelector('[role=dialog]')!
    const description = document.getElementById(dialog.getAttribute('aria-describedby')!)!
    expect(description.tagName).toBe('P')
    expect(description.textContent).toBe('Fill out the form')
    expect(description.previousElementSibling?.getAttribute('data-slot')).toBe('modal-heading')

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
          h(Modal, { 'open': open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, { body: () => 'Content' }),
        ]),
      }, { attachTo: document.body })
      mounted.push(wrapper)
      // The mount container is the sibling of the portalled dialog (the `#app` of a real page).
      const pageRoot = document.querySelector<HTMLElement>('#page')!.parentElement!.parentElement!
      return { open, wrapper, pageRoot }
    }

    it('keeps the page hidden while the outer modal is open after the inner modal closes, and releases it after the outer closes', async () => {
      // behaviour-final-check H2
      const outer = ref(true)
      const inner = ref(false)
      const wrapper = mount({
        render: () => h('div', [
          h('main', { id: 'page' }, 'Page content'),
          h(Modal, { 'open': outer.value, 'onUpdate:open': (v: boolean) => (outer.value = v) }, {
            body: () => h(Modal, { 'open': inner.value, 'onUpdate:open': (v: boolean) => (inner.value = v) }, { body: () => 'Inner' }),
          }),
        ]),
      }, { attachTo: document.body })
      mounted.push(wrapper)
      const pageRoot = document.querySelector<HTMLElement>('#page')!.parentElement!.parentElement!
      await nextTick()
      expect(pageRoot.getAttribute('aria-hidden')).toBe('true')

      inner.value = true
      await nextTick()
      expect(document.querySelectorAll('[data-slot=modal-dialog]').length).toBe(2)

      escapeKeydown()
      await finishExit()
      expect(inner.value).toBe(false)
      expect(outer.value).toBe(true)
      expect(document.querySelectorAll('[data-slot=modal-dialog]').length).toBe(1)
      expect(pageRoot.getAttribute('aria-hidden')).toBe('true')

      outer.value = false
      await finishExit()
      expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()
      expect(pageRoot.getAttribute('aria-hidden')).toBeNull()
    })

    // Each close path, repeated: the live repro leaves the page hidden from the 3rd cycle on.
    const closePaths: Array<[string, (open: { value: boolean }) => void]> = [
      ['Escape', () => escapeKeydown()],
      ['close button', () => document.querySelector<HTMLButtonElement>('[data-slot=modal-close-trigger]')!.click()],
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
        expect(document.querySelector('[data-slot=modal-dialog]'), `mounted while exiting, cycle ${cycle}`).not.toBeNull()
        await finishExit()
        expect(open.value, `closed, cycle ${cycle}`).toBe(false)
        expect(document.querySelector('[data-slot=modal-dialog]'), `unmounted, cycle ${cycle}`).toBeNull()
        expect(pageRoot.getAttribute('aria-hidden'), `aria-hidden after cycle ${cycle}`).toBeNull()
      }
    })
  })

  it('Tab skips a scrollable body and moves through the tabbable elements in order, like React Aria', async () => {
    // behaviour-final-check M3: Chrome makes an overflowing `modal-body` keyboard-focusable; RAC's FocusScope skips it
    const wrapper = mount(Modal, {
      props: { defaultOpen: true, title: 'Terms' },
      slots: {
        body: () => h('div', { 'style': 'overflow:auto;max-height:40px', 'data-testid': 'scroller' }, [h('p', 'Long text')]),
        footer: () => [h('button', 'Cancel'), h('button', 'Confirm')],
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    const tab = (shiftKey = false) => {
      const target = (document.activeElement ?? document.body) as HTMLElement
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true })
      target.dispatchEvent(event)
    }
    const name = () => {
      const el = document.activeElement as HTMLElement
      return el.dataset.slot ?? el.getAttribute('aria-label') ?? el.textContent
    }
    expect(name()).toBe('modal-dialog')
    tab()
    expect(name()).toBe('Cancel')
    tab()
    expect(name()).toBe('Confirm')
    tab()
    expect(name()).toBe('modal-close-trigger')
    tab()
    expect(name()).toBe('Cancel')
    tab(true)
    expect(name()).toBe('modal-close-trigger')
    tab(true)
    expect(name()).toBe('Confirm')
    wrapper.unmount()
  })
})
