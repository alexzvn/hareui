import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { VNodeChild } from 'vue'
import { h, nextTick } from 'vue'

import Sheet from '@/components/sheet/Sheet.vue'

import { expectAccessible } from './a11y'
import { settle } from './settle'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

type SlotFns = Record<string, (props: { close: () => void }) => VNodeChild>

const LIFECYCLE = ['enter', 'after:enter', 'leave', 'after:leave']

const slot = (name: string) => document.querySelector<HTMLElement>(`[data-slot=sheet-${name}]`)
const dialog = () => slot('dialog')

const content = (stackIndex: number) =>
  document.querySelector<HTMLElement>(`[data-slot=sheet-content][data-stack-index="${stackIndex}"]`)

const mountSheet = (props: Record<string, unknown> = {}, slots: SlotFns = {}) =>
  mount(Sheet, {
    props: { title: 'Details', ...props },
    slots: { body: () => 'Sheet content', ...slots },
    attachTo: document.body,
  })

const escapeKeydown = () =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  )

const childSlots = () => [...dialog()!.children].map((child) => child.getAttribute('data-slot'))

// Makes scrolling instant, so the sheet enters and a handle release glides at once.
const reduceMotion = () =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (media: string) =>
      ({
        media,
        matches: media.includes('reduce'),
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )

const pointer = (target: Element, type: string, clientY: number, timeStamp: number) => {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientY,
    pointerId: 1,
  })

  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  target.dispatchEvent(event)
}

// A slow mouse drag on the handle of a 400px tall sheet: 1s to move, 1s to release.
const dragHandle = (distance: number) => {
  const handle = slot('handle')!
  dialog()!.getBoundingClientRect = () => ({ width: 400, height: 400 }) as DOMRect
  pointer(handle, 'pointerdown', 100, 0)
  pointer(handle, 'pointermove', 100 + distance, 1000)
  pointer(handle, 'pointerup', 100 + distance, 2000)
}

// The latest IntersectionObserver callback: reports how much of the sheet is in view, as the browser does on scroll.
let reportIntersection: IntersectionObserverCallback | undefined

class IntersectionObserverStub {
  constructor(callback: IntersectionObserverCallback) {
    reportIntersection = callback
  }

  observe = () => undefined
  unobserve = () => undefined
  disconnect = () => undefined
  takeRecords = () => []
}

const reportVisible = (intersectionRatio: number) =>
  reportIntersection!(
    [{ intersectionRatio } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  )

const scroller = () => document.querySelector<HTMLElement>('[data-sheet-scroll]')!

// Lays out the snap markers as a browser would: the sheet rests at scroll 100 (first snap point), 300 (second) or 600
// (fully expanded). Detents carry a `100dvh` scroll margin, which happy-dom reads as 100.
const layOutSnapPoints = () => {
  const area = scroller()
  const detents = [...area.querySelectorAll<HTMLElement>('[data-sheet-detent]')]
  const markers = [...detents, area.querySelector<HTMLElement>('[data-sheet-expanded]')!]
  const tops = [200, 400, 600]

  markers.forEach((marker, index) => {
    marker.getBoundingClientRect = () =>
      ({ top: tops[index]! - area.scrollTop, left: 0, width: 1, height: 0 }) as DOMRect
  })
}

// A swipe that comes to rest at `position`.
const settleScroll = async (position: number) => {
  const area = scroller()
  area.scrollTop = position
  area.dispatchEvent(new Event('scroll'))
  area.dispatchEvent(new Event('scrollend'))
  await settle()
}

describe('sheet', () => {
  it('opens from its trigger and names the dialog from its title', async () => {
    const wrapper = mountSheet({}, { default: () => h('button', { id: 'trigger' }, 'Open') })
    expect(dialog()).toBeNull()

    document.querySelector<HTMLButtonElement>('#trigger')!.click()
    await settle()

    expect(wrapper.emitted('update:open')).toEqual([[true]])
    expect(dialog()!.getAttribute('role')).toBe('dialog')
    const heading = document.getElementById(dialog()!.getAttribute('aria-labelledby')!)!
    expect(heading.getAttribute('data-slot')).toBe('sheet-heading')
    expect(heading.textContent?.trim()).toBe('Details')
    expect(slot('body')!.textContent).toBe('Sheet content')
  })

  it('names the dialog from `title` when #content replaces the parts', async () => {
    mountSheet({ defaultOpen: true }, { content: () => h('p', 'Custom') })
    await settle()

    const title = document.getElementById(dialog()!.getAttribute('aria-labelledby')!)
    expect(title?.textContent).toBe('Details')
    expect(slot('header')).toBeNull()
  })

  it.each([
    ['bottom', true],
    ['top', true],
    ['left', false],
    ['right', false],
  ])('renders the handle by default for placement="%s": %s', async (placement, hasHandle) => {
    mountSheet({ defaultOpen: true, placement })
    await settle()

    expect(!!slot('handle')).toBe(hasHandle)
    expect(slot('content')!.dataset.placement).toBe(placement)
  })

  it.each([
    [{ placement: 'right', handle: true }, true],
    [{ placement: 'bottom', handle: false }, false],
  ])('overrides the handle default with `handle`: %o', async (props, hasHandle) => {
    mountSheet({ defaultOpen: true, ...props })
    await settle()

    expect(!!slot('handle')).toBe(hasHandle)
  })

  it.each([
    ['bottom', 0],
    ['top', -1],
  ])('renders the handle of placement="%s" at child %i', async (placement, position) => {
    mountSheet({ defaultOpen: true, placement }, { footer: () => 'Footer' })
    await settle()

    expect(childSlots().at(position)).toBe('sheet-handle')
  })

  it('hides the decorative handle and names the close button "Close"', async () => {
    mountSheet({ defaultOpen: true, closeButton: true })
    await settle()

    expect(slot('handle')!.getAttribute('aria-hidden')).toBe('true')
    expect(slot('close-trigger')!.tagName).toBe('BUTTON')
    expect(slot('close-trigger')!.getAttribute('aria-label')).toBe('Close')
  })

  it('closes from the close button', async () => {
    const wrapper = mountSheet({ defaultOpen: true, closeButton: true })
    await settle()

    slot('close-trigger')!.click()
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).toBeNull()
  })

  it('closes from the `close` slot prop', async () => {
    const wrapper = mountSheet(
      { defaultOpen: true },
      { footer: ({ close }) => h('button', { id: 'done', onClick: close }, 'Done') },
    )

    await settle()
    document.querySelector<HTMLButtonElement>('#done')!.click()
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).toBeNull()
  })

  it('follows v-model:open, staying open while the parent keeps it open', async () => {
    const wrapper = mountSheet({ open: true, closeButton: true })
    await settle()

    slot('close-trigger')!.click()
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).not.toBeNull()

    await wrapper.setProps({ open: false })
    await settle()
    expect(dialog()).toBeNull()
  })

  it.each([[{}], [{ dismissible: false }]])('closes on Escape with %o', async (props) => {
    const wrapper = mountSheet({ defaultOpen: true, ...props })
    await settle()

    escapeKeydown()
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).toBeNull()
  })

  it('stays open on Escape when not keyboard dismissible, emitting close:prevent', async () => {
    const wrapper = mountSheet({ defaultOpen: true, keyboardDismissible: false })
    await settle()

    escapeKeydown()
    await settle()
    expect(wrapper.emitted('close:prevent')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(dialog()).not.toBeNull()
  })

  it('emits enter, after:enter, leave and after:leave in order', async () => {
    const events: string[] = []
    const listeners = Object.fromEntries(
      LIFECYCLE.map((name) => [
        `on${name[0]!.toUpperCase()}${name.slice(1)}`,
        () => events.push(name),
      ]),
    )

    const wrapper = mountSheet({ open: false, ...listeners })
    await wrapper.setProps({ open: true })
    await vi.waitFor(() => expect(events).toEqual(['enter', 'after:enter']))

    await wrapper.setProps({ open: false })
    await vi.waitFor(() => expect(events).toEqual(LIFECYCLE))
    expect(dialog()).toBeNull()
  })

  it.each([
    [[148, '355px'], true],
    [['148px', 1], true],
    [['100%'], false],
  ])(
    'marks partial snap points %j, dropping a trailing full size: %s',
    async (snapPoints, isSnap) => {
      mountSheet({ defaultOpen: true, snapPoints })
      await settle()

      expect(slot('content')!.hasAttribute('data-snap-points')).toBe(isSnap)
    },
  )

  it('emits update:snapPoint with the snap point a swipe settles at', async () => {
    const wrapper = mountSheet({ defaultOpen: true, snapPoints: [100, 300] })
    await vi.waitFor(() => expect(wrapper.emitted('after:enter')).toHaveLength(1))
    layOutSnapPoints()

    await settleScroll(300)
    expect(wrapper.emitted('update:snapPoint')).toEqual([[1]])

    await settleScroll(450)
    await settleScroll(600)
    expect(wrapper.emitted('update:snapPoint')).toEqual([[1], [2]])
  })

  it('scrolls to `snapPoint` when it changes, without emitting it back', async () => {
    reduceMotion()
    const wrapper = mountSheet({ defaultOpen: true, snapPoints: [100, 300], snapPoint: 0 })
    await vi.waitFor(() => expect(wrapper.emitted('after:enter')).toHaveLength(1))
    layOutSnapPoints()

    await wrapper.setProps({ snapPoint: 2 })
    expect(scroller().scrollTop).toBe(600)

    await settleScroll(600)
    expect(wrapper.emitted('update:snapPoint')).toBeUndefined()

    await settleScroll(100)
    expect(wrapper.emitted('update:snapPoint')).toEqual([[0]])
  })

  it('marks a detached sheet', async () => {
    mountSheet({ defaultOpen: true, detached: true, placement: 'left' })
    await settle()

    expect(slot('content')!.hasAttribute('data-detached')).toBe(true)
    expect(dialog()!.dataset.placement).toBe('left')
  })

  it('closes when the sheet is swiped out of view', async () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
    const wrapper = mountSheet({ defaultOpen: true })
    await settle()

    reportVisible(1)
    await nextTick()
    expect(slot('content')!.hasAttribute('data-expanded')).toBe(true)

    reportVisible(0)
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).toBeNull()
  })

  it('closes when the handle is dragged past a quarter of the sheet', async () => {
    reduceMotion()
    const wrapper = mountSheet({ defaultOpen: true })
    await vi.waitFor(() => expect(wrapper.emitted('after:enter')).toHaveLength(1))

    dragHandle(200)
    await settle()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(dialog()).toBeNull()
  })

  it('springs back after a short handle drag, marking the handle while dragging', async () => {
    reduceMotion()
    const wrapper = mountSheet({ defaultOpen: true })
    await vi.waitFor(() => expect(wrapper.emitted('after:enter')).toHaveLength(1))

    const handle = slot('handle')!
    pointer(handle, 'pointerdown', 100, 0)
    expect(handle.hasAttribute('data-dragging')).toBe(true)

    pointer(handle, 'pointerup', 100, 1000)
    expect(handle.hasAttribute('data-dragging')).toBe(false)

    dragHandle(50)
    await settle()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(dialog()).not.toBeNull()
  })

  it('stacks a nested sheet above its parent', async () => {
    const nested = () =>
      h(
        Sheet,
        { defaultOpen: true, title: 'Nested', closeButton: true },
        { body: () => 'Nested content' },
      )

    mountSheet({ defaultOpen: true }, { body: nested })
    await settle()

    expect(content(0)!.hasAttribute('data-has-descendants')).toBe(true)
    expect(content(1)!.textContent).toContain('Nested content')
    expect(content(1)!.hasAttribute('data-has-descendants')).toBe(false)

    content(1)!.querySelector<HTMLButtonElement>('[data-slot=sheet-close-trigger]')!.click()
    await settle()
    expect(content(1)).toBeNull()
    expect(content(0)!.hasAttribute('data-has-descendants')).toBe(false)
  })

  it('returns focus to the nested trigger when a nested sheet closes', async () => {
    const nested = () =>
      h(
        Sheet,
        { title: 'Nested' },
        { default: () => h('button', 'Open nested'), body: () => 'Nested content' },
      )

    mountSheet({ defaultOpen: true }, { body: nested })
    await settle()

    const trigger = [...document.querySelectorAll('button')].find(
      (button) => button.textContent === 'Open nested',
    )!

    trigger.focus()
    trigger.click()
    await settle()
    expect(content(1)).not.toBeNull()

    escapeKeydown()
    await settle()
    expect(document.activeElement).toBe(trigger)
  })

  it('has no axe violations open', async () => {
    mountSheet(
      { defaultOpen: true, closeButton: true },
      { footer: ({ close }) => h('button', { onClick: close }, 'Done') },
    )

    await settle()
    expect(dialog()).not.toBeNull()
    await expectAccessible()
  })
})
