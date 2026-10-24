import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import Popover from '@/components/popover/Popover.vue'

import { expectAccessible } from './a11y'

let wrapper: ReturnType<typeof mount> | undefined
let outside: HTMLButtonElement | undefined

const mountPopover = (props: Record<string, unknown> = {}) => {
  outside = document.createElement('button')
  outside.id = 'outside'
  outside.textContent = 'Outside'
  document.body.appendChild(outside)
  wrapper = mount(Popover, {
    props: { title: 'Title', ...props },
    slots: {
      default: () => h('button', { 'data-testid': 'trigger' }, 'Open'),
      content: () => h('p', 'Body'),
    },
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  outside?.remove()
  outside = undefined
})

const content = () => document.querySelector<HTMLElement>('[data-slot=popover]')
const triggerEl = () => document.querySelector<HTMLElement>('[data-testid=trigger]')!

const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick()
}

const hiddenFromAT = (el: HTMLElement): boolean => {
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('inert')) return true
  }
  return false
}

describe('popover', () => {
  it('hides content outside the popover from assistive tech while open', async () => {
    // behaviour-final-check H9 / P1
    mountPopover({ defaultOpen: true })
    await settle()
    expect(content()).not.toBeNull()
    expect(hiddenFromAT(outside!)).toBe(true)
    expect(hiddenFromAT(content()!)).toBe(false)
  })

  it('locks page scroll while open and releases it on close', async () => {
    // behaviour-final-check H9 / P1
    const w = mountPopover({ defaultOpen: true })
    await settle()
    const locked = () =>
      getComputedStyle(document.documentElement).overflow === 'hidden' ||
      getComputedStyle(document.body).overflow === 'hidden'
    expect(locked()).toBe(true)
    await w.setProps({ open: false })
    await settle()
    expect(locked()).toBe(false)
  })

  it('returns focus to the trigger after an outside click closes it', async () => {
    // behaviour-final-check P2
    const w = mountPopover({ defaultOpen: true })
    await settle()
    expect(content()).not.toBeNull()

    outside!.focus()
    outside!.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        pointerType: 'mouse',
        ctrlKey: false,
      }),
    )
    outside!.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
    )
    outside!.click()
    await settle()

    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    expect(document.activeElement).toBe(triggerEl())
  })

  it('marks the trigger pressed only while the popover is open', async () => {
    // behaviour-final-check P3
    const w = mountPopover({ defaultOpen: true })
    await settle()
    expect(triggerEl().getAttribute('data-pressed')).toBe('true')
    await w.setProps({ open: false })
    await settle()
    expect(triggerEl().getAttribute('data-pressed')).toBeNull()
  })

  it('labels the dialog by its h2 title heading', async () => {
    // behaviour-final-check P4
    mountPopover({ defaultOpen: true })
    await settle()
    const heading = document.querySelector<HTMLElement>('[data-slot=popover-heading]')!
    expect(heading.tagName).toBe('H2')
    expect(content()!.getAttribute('role')).toBe('dialog')
    expect(content()!.getAttribute('aria-labelledby')).toBe(heading.id)
  })

  it('stays open on a right click outside, like React Aria', async () => {
    const w = mountPopover({ defaultOpen: true })
    await settle()
    outside!.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 2, pointerType: 'mouse' }),
    )
    await new Promise((r) => setTimeout(r, 0))
    outside!.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 2, pointerType: 'mouse' }),
    )
    await settle()
    expect(w.emitted('update:open')).toBeUndefined()
    expect(content()).not.toBeNull()
  })

  it('stays open on an outside click when not dismissible', async () => {
    const w = mountPopover({ defaultOpen: true, dismissible: false })
    await settle()
    outside!.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }),
    )
    await new Promise((r) => setTimeout(r, 0))
    outside!.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }),
    )
    await settle()
    expect(w.emitted('update:open')).toBeUndefined()
  })

  it('passes axe while closed', async () => {
    const w = mountPopover()
    await settle()
    await expectAccessible(w)
  })

  it('passes axe while open with a title', async () => {
    mountPopover({ defaultOpen: true })
    await settle()
    expect(content()).not.toBeNull()
    await expectAccessible()
  })

  it('passes axe while open without a title', async () => {
    mountPopover({ defaultOpen: true, title: undefined })
    await settle()
    expect(content()).not.toBeNull()
    await expectAccessible()
  })

  it('wires the trigger to the dialog with aria-haspopup, aria-expanded and aria-controls', async () => {
    const w = mountPopover()
    await settle()
    expect(triggerEl().getAttribute('aria-haspopup')).toBe('dialog')
    expect(triggerEl().getAttribute('aria-expanded')).toBe('false')
    triggerEl().click()
    await settle()
    expect(triggerEl().getAttribute('aria-expanded')).toBe('true')
    expect(triggerEl().getAttribute('aria-controls')).toBe(content()!.id)
    await w.setProps({ open: false })
    await settle()
    expect(triggerEl().getAttribute('aria-expanded')).toBe('false')
  })

  it('without a title, names the dialog by its trigger', async () => {
    mountPopover({ defaultOpen: true, title: undefined })
    await settle()
    const labelledBy = content()!.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelledBy)).toBe(triggerEl())
  })

  it('moves focus into the dialog on open, traps Tab inside it, and Escape returns focus to the trigger', async () => {
    wrapper = mount(Popover, {
      props: { title: 'Title' },
      slots: {
        default: () => h('button', { 'data-testid': 'trigger' }, 'Open'),
        content: () => [h('button', { id: 'first' }, 'First'), h('button', { id: 'last' }, 'Last')],
      },
      attachTo: document.body,
    })
    triggerEl().focus()
    triggerEl().click()
    await settle()
    const dialog = document.querySelector<HTMLElement>('[data-slot=popover-dialog]')!
    expect(document.activeElement).toBe(dialog)

    const last = document.getElementById('last')!
    last.focus()
    last.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    )
    await settle()
    expect(document.activeElement).toBe(document.getElementById('first'))

    const first = document.getElementById('first')!
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    )
    await settle()
    expect(document.activeElement).toBe(last)

    last.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await settle()
    expect(content()).toBeNull()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(document.activeElement).toBe(triggerEl())
  })

  it('ignores Escape when not dismissible', async () => {
    const w = mountPopover({ defaultOpen: true, dismissible: false })
    await settle()
    document
      .querySelector<HTMLElement>('[data-slot=popover-dialog]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    await settle()
    expect(w.emitted('update:open')).toBeUndefined()
    expect(content()).not.toBeNull()
  })
})
