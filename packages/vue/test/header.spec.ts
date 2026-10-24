import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import Header from '../src/components/header/Header.vue'
import type { HeaderProps } from '../src/components/header/Header.vue'
import { expectAccessible } from './a11y'

// Reka's Presence needs three ticks before a closed dialog leaves the DOM (see modal.spec.ts).
async function settle() {
  for (let i = 0; i < 4; i++) await nextTick()
}

const toggle = () => document.querySelector<HTMLButtonElement>('[data-slot=header-toggle]')!

// Vue's event invoker ignores events stamped in the millisecond its listener was attached (`_vts <= attached`), so a
// click fired right after mounting can be dropped. A real click never lands that fast.
async function click(el: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, 2))
  el.click()
}

function mountHeader(
  props: Partial<HeaderProps> & Record<string, unknown> = {},
  slots: Record<string, () => any> = { body: () => h('a', { href: '#docs', id: 'link' }, 'Docs') },
) {
  return mount(Header, { props, slots, attachTo: document.body })
}

describe('header menu', () => {
  it('the toggle opens and closes the menu and reports it through v-model:open', async () => {
    const open = ref(false)
    const wrapper = mount(
      {
        render: () =>
          h(
            Header,
            { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) },
            { body: () => 'Menu body' },
          ),
      },
      { attachTo: document.body },
    )

    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    expect(toggle().getAttribute('aria-label')).toBe('Open menu')

    await click(toggle())
    await settle()
    expect(open.value).toBe(true)
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()
    expect(document.querySelector('[data-slot=header-menu-body]')?.textContent).toBe('Menu body')
    expect(document.querySelector('[data-slot=header]')?.getAttribute('data-menu-open')).toBe(
      'true',
    )
    // The menu repeats the bar's toggle (now a close button) in its own header.
    const toggles = document.querySelectorAll('[data-slot=header-toggle]')
    expect(toggles).toHaveLength(2)
    expect(toggles[1]!.getAttribute('aria-label')).toBe('Close menu')

    await click(document.querySelectorAll<HTMLElement>('[data-slot=header-toggle]')[1]!)
    await settle()
    expect(open.value).toBe(false)
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()

    wrapper.unmount()
  })

  it('renders no toggle and no menu without a body or content slot, unless toggle is customised through its slot', async () => {
    const plain = mountHeader({}, {})
    expect(document.querySelector('[data-slot=header-toggle]')).toBeNull()
    plain.unmount()

    const custom = mountHeader({}, { toggle: () => h('button', { 'data-testid': 'custom' }, 'x') })
    expect(document.querySelector('[data-testid=custom]')).not.toBeNull()
    custom.unmount()

    const hidden = mountHeader({ toggle: false })
    expect(document.querySelector('[data-slot=header-toggle]')).toBeNull()
    hidden.unmount()
  })

  it('maps mode to Modal or to a Drawer on the right / at the bottom', async () => {
    for (const [mode, selector] of [
      ['modal', '[data-slot=modal-dialog]'],
      ['slideover', '[data-slot=drawer-dialog][data-placement=right]'],
      ['drawer', '[data-slot=drawer-dialog][data-placement=bottom]'],
    ] as const) {
      const wrapper = mountHeader({ mode })
      await click(toggle())
      await settle()
      expect(document.querySelector(selector), mode).not.toBeNull()
      // Only `drawer` has no menu header.
      expect(!!document.querySelector('[data-slot=header-menu-header]'), mode).toBe(
        mode !== 'drawer',
      )
      wrapper.unmount()
      await settle()
    }
  })

  it("anchors the menu to the bar: the overlay sits in a region starting at the bar's top edge", async () => {
    const wrapper = mountHeader()
    const bar = document.querySelector<HTMLElement>('[data-slot=header-container]')!
    bar.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 120, width: 390, height: 64 })
    document.querySelector<HTMLElement>('[data-slot=header]')!.getBoundingClientRect = () =>
      DOMRect.fromRect({ x: 24, y: 120, width: 342, height: 64 })
    await click(toggle())
    await settle()
    const anchor = document.querySelector<HTMLElement>('[data-slot=header-menu-anchor]')!
    expect(anchor.parentElement).toBe(document.body)
    expect(anchor.querySelector('[data-slot=modal-dialog]')).not.toBeNull()
    expect(anchor.style.getPropertyValue('--header-menu-top')).toBe('120px')
    expect(anchor.style.getPropertyValue('--header-menu-left')).toBe('24px')
    expect(anchor.style.getPropertyValue('--header-menu-width')).toBe('342px')
    expect(anchor.style.getPropertyValue('--header-menu-height')).toBe(
      `${window.innerHeight - 120}px`,
    )
    wrapper.unmount()
  })

  it('clamps the menu region to a portal target that contains fixed layers (contain: layout)', async () => {
    const frame = document.createElement('div')
    frame.style.contain = 'layout'
    document.body.append(frame)
    Object.defineProperty(frame, 'clientTop', { value: 1 })
    Object.defineProperty(frame, 'clientLeft', { value: 1 })
    Object.defineProperty(frame, 'clientHeight', { value: 286 })
    frame.getBoundingClientRect = () => DOMRect.fromRect({ x: 41, y: 278, width: 308, height: 288 })
    const wrapper = mountHeader({ menu: { portal: frame } })
    document.querySelector<HTMLElement>('[data-slot=header-container]')!.getBoundingClientRect =
      () => DOMRect.fromRect({ x: 42, y: 279, width: 306, height: 64 })
    document.querySelector<HTMLElement>('[data-slot=header]')!.getBoundingClientRect = () =>
      DOMRect.fromRect({ x: 42, y: 279, width: 306, height: 64 })
    await click(toggle())
    await settle()
    const anchor = document.querySelector<HTMLElement>('[data-slot=header-menu-anchor]')!
    expect(anchor.parentElement).toBe(frame)
    // Coordinates are relative to the frame's padding box, and the region ends at the frame's bottom.
    expect(anchor.style.getPropertyValue('--header-menu-top')).toBe('0px')
    expect(anchor.style.getPropertyValue('--header-menu-left')).toBe('0px')
    expect(anchor.style.getPropertyValue('--header-menu-width')).toBe('306px')
    expect(anchor.style.getPropertyValue('--header-menu-height')).toBe('286px')
    wrapper.unmount()
    frame.remove()
  })

  it('menu props override the mode defaults', async () => {
    const wrapper = mountHeader({ mode: 'slideover', menu: { placement: 'left' } })
    await click(toggle())
    await settle()
    expect(document.querySelector('[data-slot=drawer-dialog][data-placement=left]')).not.toBeNull()
    wrapper.unmount()
  })

  it('closes when a link inside the menu is clicked, unless autoClose is off', async () => {
    const auto = mountHeader()
    await click(toggle())
    await settle()
    await click(document.querySelector<HTMLElement>('#link')!)
    await settle()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()
    auto.unmount()
    await settle()

    const manual = mountHeader({ autoClose: false })
    await click(toggle())
    await settle()
    await click(document.querySelector<HTMLElement>('#link')!)
    await settle()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()
    manual.unmount()
  })

  it('closes on hashchange when autoClose is on', async () => {
    const wrapper = mountHeader()
    await click(toggle())
    await settle()
    window.dispatchEvent(new Event('hashchange'))
    await settle()
    expect(document.querySelector('[data-slot=modal-dialog]')).toBeNull()
    wrapper.unmount()
  })

  it('locks page scroll while open, and leaves it alone with shouldBlockScroll=false', async () => {
    const locked = mountHeader()
    await click(toggle())
    await settle()
    expect(document.body.style.overflow).toBe('hidden')
    await click(toggle())
    await settle()
    expect(document.body.style.overflow).toBe('')
    locked.unmount()
    await settle()

    const free = mountHeader({ shouldBlockScroll: false })
    await click(toggle())
    await settle()
    expect(document.querySelector('[data-slot=modal-dialog]')).not.toBeNull()
    expect(document.body.style.overflow).toBe('')
    await click(toggle())
    await settle()
    expect(document.body.style.overflow).toBe('')
    free.unmount()
  })
})

describe('header hideOnScroll', () => {
  beforeEach(() => {
    // Run the rAF-throttled update synchronously.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  })

  const root = () => document.querySelector<HTMLElement>('[data-slot=header]')!
  function scrollTo(y: number) {
    Object.assign(window, { scrollY: y })
    window.dispatchEvent(new Event('scroll'))
  }

  it('hides on scroll down, reveals on scroll up, and always shows at the top', async () => {
    const hidden = ref(false)
    const wrapper = mount(
      {
        render: () =>
          h(Header, {
            hideOnScroll: true,
            hidden: hidden.value,
            'onUpdate:hidden': (v: boolean) => (hidden.value = v),
          }),
      },
      { attachTo: document.body },
    )
    Object.defineProperty(root(), 'offsetHeight', { configurable: true, value: 64 })

    scrollTo(40) // still within the bar's own height
    await nextTick()
    expect(hidden.value).toBe(false)

    scrollTo(200)
    await nextTick()
    expect(hidden.value).toBe(true)
    expect(root().getAttribute('data-hidden')).toBe('true')

    scrollTo(300)
    await nextTick()
    expect(hidden.value).toBe(true)

    scrollTo(290)
    await nextTick()
    expect(hidden.value).toBe(false)
    expect(root().getAttribute('data-hidden')).toBeNull()

    scrollTo(500)
    await nextTick()
    expect(hidden.value).toBe(true)
    scrollTo(10)
    await nextTick()
    expect(hidden.value).toBe(false)

    wrapper.unmount()
  })

  it('does nothing without hideOnScroll', async () => {
    const wrapper = mountHeader({}, {})
    scrollTo(500)
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()
    wrapper.unmount()
  })

  it('reveals the bar when it receives focus', async () => {
    const wrapper = mountHeader(
      { hideOnScroll: true },
      { right: () => h('button', { id: 'action' }, 'x') },
    )
    scrollTo(300)
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBe('true')

    document.querySelector('#action')!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()
    wrapper.unmount()
  })

  it('does not hide while the menu is open', async () => {
    const wrapper = mountHeader({ hideOnScroll: true })
    await click(toggle())
    await settle()
    scrollTo(400)
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()
    wrapper.unmount()
  })

  it('tracks a custom scroll container instead of the window', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mountHeader({ hideOnScroll: true, scrollTarget: container })

    scrollTo(500) // window scroll is ignored
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()

    container.scrollTop = 300
    container.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBe('true')

    container.scrollTop = 100
    container.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()

    wrapper.unmount()
    container.remove()
  })

  it('uses the nearest scrollable ancestor by default', async () => {
    const container = document.createElement('div')
    container.style.overflowY = 'auto'
    document.body.appendChild(container)
    const wrapper = mount(Header, { props: { hideOnScroll: true }, attachTo: container })

    container.scrollTop = 300
    container.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBe('true')

    wrapper.unmount()
    container.remove()
  })

  it('switching hideOnScroll off reveals the bar and stops listening', async () => {
    const wrapper = mountHeader({ hideOnScroll: true }, {})
    scrollTo(300)
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBe('true')

    await wrapper.setProps({ hideOnScroll: false })
    expect(root().getAttribute('data-hidden')).toBeNull()
    scrollTo(900)
    await nextTick()
    expect(root().getAttribute('data-hidden')).toBeNull()
    wrapper.unmount()
  })

  it('height sets --header-height', () => {
    const wrapper = mountHeader({ height: '2.75rem' }, {})
    expect(root().style.getPropertyValue('--header-height')).toBe('2.75rem')
    wrapper.unmount()
  })
})

describe('header accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.cssText = ''
  })

  const dialog = () => document.querySelector<HTMLElement>('[role=dialog]')

  it('renders the banner landmark with a named home link and a named, collapsed menu toggle, and passes axe', async () => {
    const wrapper = mountHeader(
      {},
      {
        body: () => h('a', { href: '#docs' }, 'Docs'),
        right: () => h('button', { type: 'button' }, 'Sign in'),
      },
    )
    const header = document.querySelector('header')!
    // A header outside sectioning content maps to the banner landmark.
    expect(header.closest('article, aside, main, nav, section')).toBeNull()
    const home = header.querySelector<HTMLAnchorElement>('[data-slot=header-title]')!
    expect(home.getAttribute('href')).toBe('/')
    expect(home.getAttribute('aria-label')).toBe('HareUI')
    expect(toggle().tagName).toBe('BUTTON')
    expect(toggle().getAttribute('type')).toBe('button')
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('names a logo-only home link from title, and passes axe with inline navigation', async () => {
    const wrapper = mountHeader(
      { title: 'Acme' },
      {
        title: () => h('svg', { 'aria-hidden': 'true' }),
        default: () => h('nav', { 'aria-label': 'Main' }, [h('a', { href: '/docs' }, 'Docs')]),
      },
    )
    expect(document.querySelector('[data-slot=header-title]')!.getAttribute('aria-label')).toBe(
      'Acme',
    )
    expect(document.querySelector('[data-slot=header-toggle]')).toBeNull()
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  for (const mode of ['modal', 'slideover', 'drawer'] as const) {
    it(`${mode} menu: a dialog named by menuTitle with an expanded, renamed toggle, and passes axe`, async () => {
      const wrapper = mountHeader({ mode, menuTitle: 'Site menu' })
      await click(toggle())
      await settle()
      const el = dialog()!
      expect(document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Site menu',
      )
      expect(toggle().getAttribute('aria-expanded')).toBe('true')
      expect(toggle().getAttribute('aria-label')).toBe('Close menu')
      await expectAccessible(document.body)
      wrapper.unmount()
    })
  }

  it('opening moves focus into the menu and Tab is trapped inside it', async () => {
    const wrapper = mountHeader()
    toggle().focus()
    await click(toggle())
    await settle()
    const el = dialog()!
    expect(el.contains(document.activeElement)).toBe(true)

    const focusables = [...el.querySelectorAll<HTMLElement>('a[href], button')]
    const first = focusables[0]!
    const last = focusables.at(-1)!
    last.focus()
    last.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    )
    expect(document.activeElement).toBe(first)
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    )
    expect(document.activeElement).toBe(last)
    wrapper.unmount()
  })

  it('Escape closes the menu and returns focus to the bar toggle', async () => {
    const wrapper = mountHeader()
    toggle().focus()
    await click(toggle())
    await settle()
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await settle()
    expect(dialog()).toBeNull()
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle())
    wrapper.unmount()
  })

  it("the menu's own close toggle returns focus to the bar toggle", async () => {
    const wrapper = mountHeader()
    toggle().focus()
    await click(toggle())
    await settle()
    await click(dialog()!.querySelector<HTMLElement>('[data-slot=header-toggle]')!)
    await settle()
    expect(dialog()).toBeNull()
    expect(document.activeElement).toBe(toggle())
    wrapper.unmount()
  })
})
