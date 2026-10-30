import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import type { TocLink } from '@/components/toc'
import { createCircuitPath, flattenLinks } from '@/components/toc/links'
import Toc from '@/components/toc/Toc.vue'

import { expectAccessible } from './a11y'
import { settle } from './settle'

const links: TocLink[] = [
  { id: 'packing', text: 'Packing list', depth: 2 },
  {
    id: 'route',
    text: 'The route',
    depth: 2,
    children: [
      { id: 'day-one', text: 'Day one', depth: 3 },
      { id: 'day-two', text: 'Day two', depth: 3 },
    ],
  },
  { id: 'camp', text: 'Making camp', depth: 2 },
]

// happy-dom never reports intersections: record every observer and let the test say which headings are in view.
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = []
  readonly targets = new Set<Element>()

  constructor(readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this)
  }

  observe = (target: Element) => {
    this.targets.add(target)
  }

  unobserve = (target: Element) => {
    this.targets.delete(target)
  }

  disconnect = () => {
    this.targets.clear()
  }

  takeRecords = () => []
}

const intersect = (changes: Record<string, boolean>) => {
  for (const observer of FakeIntersectionObserver.instances) {
    const entries = [...observer.targets]
      .filter((target) => target.id in changes)
      .map((target) => ({ target, isIntersecting: changes[target.id] }))

    if (entries.length > 0)
      observer.callback(
        entries as unknown as IntersectionObserverEntry[],
        observer as unknown as IntersectionObserver,
      )
  }
}

let wrapper: ReturnType<typeof mount> | undefined
let article: HTMLElement | undefined

const addHeadings = () => {
  article = document.createElement('article')

  for (const { link } of flattenLinks(links)) {
    const heading = document.createElement('h2')
    heading.id = link.id
    heading.textContent = link.text
    article.appendChild(heading)
  }

  document.body.appendChild(article)
}

const mountToc = (
  options: { props?: Record<string, unknown>; slots?: Record<string, unknown> } = {},
) => {
  wrapper = mount(Toc, {
    props: { links, ...options.props },
    slots: options.slots as never,
    attachTo: document.body,
  })

  return wrapper
}

const linkNamed = (name: string, root: ParentNode = document) =>
  [...root.querySelectorAll<HTMLAnchorElement>('[data-slot=toc-link]')].find(
    (link) => link.textContent?.trim() === name,
  )

const marks = () => document.querySelector<HTMLButtonElement>('[data-slot=toc-marks]')!
const panel = () => document.querySelector<HTMLElement>('[data-slot=toc-panel]')

const pointer = (type: string, pointerType = 'mouse') =>
  new PointerEvent(type, { bubbles: false, pointerType })

beforeEach(() => {
  FakeIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  addHeadings()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  article?.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  history.replaceState(null, '', location.pathname)
})

describe('Toc list', () => {
  it('renders a labelled navigation with one link per heading, nested under its parent', async () => {
    mountToc()
    await settle()

    const nav = document.querySelector('nav')!
    expect(nav.getAttribute('aria-label')).toBe('On this page')
    expect(linkNamed('Packing list')?.getAttribute('href')).toBe('#packing')

    const nested = linkNamed('Day one')!.closest('ul')!
    expect(nested.closest('li')?.querySelector('a')?.textContent?.trim()).toBe('The route')
    await expectAccessible(nav)
  })

  it('renders the title, or the default slot in its place', async () => {
    mountToc({ props: { title: 'In this guide' } })
    expect(document.querySelector('[data-slot=toc-title]')?.textContent).toBe('In this guide')
    wrapper!.unmount()

    mountToc({ slots: { default: () => 'Sections' } })
    expect(document.querySelector('[data-slot=toc-title]')?.textContent).toBe('Sections')
  })

  it('marks the links of the headings in view as the current location', async () => {
    mountToc()
    await settle()

    intersect({ route: true, 'day-one': true })
    await settle()

    expect(linkNamed('The route')?.getAttribute('aria-current')).toBe('location')
    expect(linkNamed('Day one')?.getAttribute('aria-current')).toBe('location')
    expect(linkNamed('Packing list')?.hasAttribute('aria-current')).toBe(false)
  })

  it('keeps the last active links while no heading is in view', async () => {
    mountToc()
    await settle()

    intersect({ camp: true })
    await settle()
    intersect({ camp: false })
    await settle()
    intersect({ packing: false })
    await settle()

    expect(linkNamed('Making camp')?.getAttribute('aria-current')).toBe('location')
  })

  it('forgets the active links when the links change', async () => {
    mountToc({ props: { highlight: true } })
    await settle()

    intersect({ camp: true })
    await settle()
    intersect({ camp: false })
    await settle()

    await wrapper!.setProps({ links: links.slice(0, 2) })
    await settle()

    expect(document.querySelector('[aria-current]')).toBeNull()
    expect(document.querySelector('[data-slot=toc-indicator-active]')).toBeNull()
  })

  it('scrolls to the heading, updates the hash and emits move on click', async () => {
    const scrollIntoView = vi.fn<Element['scrollIntoView']>()
    document.getElementById('camp')!.scrollIntoView = scrollIntoView
    mountToc()

    linkNamed('Making camp')!.click()
    await settle()

    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'start' }))
    expect(location.hash).toBe('#camp')
    expect(wrapper!.emitted('move')).toEqual([['camp']])
  })

  it('marks a clicked link active right away, while the scroll it starts is still running', async () => {
    vi.useFakeTimers()
    document.getElementById('camp')!.scrollIntoView = vi.fn<Element['scrollIntoView']>()
    mountToc()
    await settle()
    intersect({ route: true })
    await settle()

    linkNamed('Making camp')!.click()
    await settle()
    expect(linkNamed('Making camp')?.getAttribute('aria-current')).toBe('location')

    window.dispatchEvent(new Event('scroll'))
    intersect({ route: false, 'day-one': true })
    await settle()
    expect(linkNamed('Making camp')?.getAttribute('aria-current')).toBe('location')
    expect(linkNamed('Day one')?.hasAttribute('aria-current')).toBe(false)
  })

  it('keeps a clicked link active once the scroll settles short of its heading', async () => {
    vi.useFakeTimers()
    document.getElementById('camp')!.scrollIntoView = vi.fn<Element['scrollIntoView']>()
    mountToc()
    await settle()

    linkNamed('Making camp')!.click()
    intersect({ packing: true })
    vi.advanceTimersByTime(200)
    await settle()

    expect(linkNamed('Making camp')?.getAttribute('aria-current')).toBe('location')
  })

  it('follows the scroll position again once the clicked scroll has settled', async () => {
    vi.useFakeTimers()
    document.getElementById('camp')!.scrollIntoView = vi.fn<Element['scrollIntoView']>()
    mountToc()
    await settle()

    linkNamed('Making camp')!.click()
    vi.advanceTimersByTime(200)
    intersect({ route: true })
    await settle()

    expect(linkNamed('The route')?.getAttribute('aria-current')).toBe('location')
    expect(linkNamed('Making camp')?.hasAttribute('aria-current')).toBe(false)
  })

  it('opens the collapsible list from its trigger and supports v-model:open', async () => {
    mountToc()
    const trigger = document.querySelector<HTMLButtonElement>('button[data-slot=toc-trigger]')!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    trigger.click()
    await settle()

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(wrapper!.emitted('update:open')).toEqual([[true]])

    await wrapper!.setProps({ open: false })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('renders the link, top and bottom slots', async () => {
    mountToc({
      slots: {
        link: ({ link, active, level }: { link: TocLink; active: boolean; level: number }) =>
          h('span', { 'data-testid': 'custom' }, `${link.text}:${level}:${active}`),
        top: ({ links: all }: { links: TocLink[] }) => h('p', `${all.length} sections`),
        bottom: () => h('a', { href: '#top' }, 'Back to top'),
      },
    })

    await settle()

    const custom = [...document.querySelectorAll('[data-testid=custom]')].map(
      (el) => el.textContent,
    )

    expect(custom).toContain('Day two:1:false')
    expect(document.querySelector('[data-slot=toc-top]')?.textContent).toBe('3 sections')
    expect(document.querySelector('[data-slot=toc-bottom]')?.textContent).toBe('Back to top')
  })

  it('replaces the list with the content slot', () => {
    mountToc({ slots: { content: () => h('p', { 'data-testid': 'own-list' }, 'Own list') } })

    expect(document.querySelector('[data-testid=own-list]')).not.toBeNull()
    expect(linkNamed('Packing list')).toBeUndefined()
  })

  it('renders the highlight indicator only when highlight is set', async () => {
    mountToc()
    expect(document.querySelector('[data-slot=toc-indicator]')).toBeNull()

    await wrapper!.setProps({ highlight: { variant: 'circuit', color: 'success' } })
    expect(document.querySelector('[data-slot=toc-indicator]')).not.toBeNull()
  })

  it('renders nothing but the slots when there are no links', () => {
    mountToc({ props: { links: [] }, slots: { bottom: () => 'Edit this page' } })

    expect(document.querySelector('[data-slot=toc-trigger]')).toBeNull()
    expect(document.querySelector('[data-slot=toc-bottom]')?.textContent).toBe('Edit this page')
  })
})

describe('Toc floating', () => {
  it('renders one mark per link on a labelled button, the active one marked', async () => {
    mountToc({ props: { variant: 'floating' } })
    await settle()
    intersect({ route: true, camp: true })
    await settle()

    const button = marks()
    expect(button.getAttribute('aria-label')).toBe('On this page')
    expect(button.getAttribute('aria-expanded')).toBe('false')

    const all = [...button.querySelectorAll('[data-slot=toc-mark]')]
    expect(all).toHaveLength(5)

    expect(all.map((mark) => mark.hasAttribute('data-active'))).toEqual([
      false,
      true,
      false,
      false,
      false,
    ])
  })

  it('marks the last heading in view once the headings have scrolled to their end', async () => {
    article!.style.overflowY = 'auto'
    Object.defineProperty(article, 'clientHeight', { value: 400 })
    Object.defineProperty(article, 'scrollHeight', { value: 1000 })
    mountToc({ props: { variant: 'floating' } })
    await settle()
    intersect({ route: true, camp: true })

    const activeMarks = () =>
      [...marks().querySelectorAll('[data-slot=toc-mark]')].map((mark) =>
        mark.hasAttribute('data-active'),
      )

    article!.scrollTop = 500
    article!.dispatchEvent(new Event('scroll'))
    await settle()
    expect(activeMarks()).toEqual([false, true, false, false, false])

    article!.scrollTop = 600
    article!.dispatchEvent(new Event('scroll'))
    await settle()
    expect(activeMarks()).toEqual([false, false, false, false, true])
  })

  it('opens the panel after the hover delay and closes it after the close delay', async () => {
    vi.useFakeTimers()
    mountToc({ props: { variant: 'floating', delay: 100, closeDelay: 250 } })

    marks().dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(99)
    await settle()
    expect(panel()).toBeNull()

    vi.advanceTimersByTime(1)
    await settle()
    expect(panel()).not.toBeNull()
    expect(marks().getAttribute('aria-expanded')).toBe('true')
    expect(document.getElementById(marks().getAttribute('aria-controls')!)).toBe(panel())

    marks().dispatchEvent(pointer('pointerleave'))
    panel()!.dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(400)
    await settle()
    expect(panel()).not.toBeNull()

    panel()!.dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(250)
    await settle()
    expect(wrapper!.emitted('update:open')).toEqual([[true], [false]])
  })

  it('ignores touch hover and opens on click instead', async () => {
    vi.useFakeTimers()
    mountToc({ props: { variant: 'floating' } })

    marks().dispatchEvent(pointer('pointerenter', 'touch'))
    vi.advanceTimersByTime(500)
    await settle()
    expect(panel()).toBeNull()

    marks().click()
    await settle()
    expect(panel()).not.toBeNull()
  })

  it('keeps a hover-opened panel open once the marks are clicked', async () => {
    vi.useFakeTimers()
    mountToc({ props: { variant: 'floating' } })

    marks().dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(200)
    await settle()
    marks().click()
    marks().dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(1000)
    await settle()

    expect(panel()).not.toBeNull()
  })

  it('opens only on click with trigger press', async () => {
    vi.useFakeTimers()
    mountToc({ props: { variant: 'floating', trigger: 'press' } })

    marks().dispatchEvent(pointer('pointerenter'))
    vi.advanceTimersByTime(1000)
    await settle()
    expect(panel()).toBeNull()

    marks().click()
    await settle()
    expect(panel()).not.toBeNull()

    marks().click()
    await settle()
    expect(wrapper!.emitted('update:open')).toEqual([[true], [false]])
  })

  it('lists the links in a labelled dialog, focusing the active one when opened by click', async () => {
    mountToc({ props: { variant: 'floating', trigger: 'press' } })
    await settle()
    intersect({ 'day-one': true })
    await settle()

    marks().click()
    await settle()

    const dialog = panel()!
    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(dialog.getAttribute('aria-label')).toBe('On this page')
    expect(linkNamed('Day one', dialog)?.getAttribute('aria-current')).toBe('location')
    expect(document.activeElement).toBe(linkNamed('Day one', dialog))
    await expectAccessible(dialog)
  })

  it('closes the panel and moves to the heading when a link is chosen', async () => {
    mountToc({ props: { variant: 'floating', defaultOpen: true } })
    await settle()

    linkNamed('The route', panel()!)!.click()
    await settle()

    expect(wrapper!.emitted('move')).toEqual([['route']])
    expect(wrapper!.emitted('update:open')).toEqual([[false]])
  })

  it('closes on Escape and returns focus to the marks', async () => {
    mountToc({ props: { variant: 'floating', trigger: 'press' } })
    marks().click()
    await settle()

    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )

    await settle()

    expect(wrapper!.emitted('update:open')).toEqual([[true], [false]])
    expect(document.activeElement).toBe(marks())
  })

  it('returns focus to the marks without scrolling back to them when a link is chosen', async () => {
    document.getElementById('route')!.scrollIntoView = vi.fn<Element['scrollIntoView']>()
    mountToc({ props: { variant: 'floating', trigger: 'press' } })
    marks().click()
    await settle()

    const focus = vi.spyOn(marks(), 'focus')
    linkNamed('The route', panel()!)!.click()
    await settle()

    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.activeElement).toBe(marks())
  })

  it('renders the top and bottom slots inside the panel', async () => {
    mountToc({
      props: { variant: 'floating', open: true },
      slots: { top: () => 'Contents', bottom: () => 'Back to top' },
    })

    await settle()

    expect(panel()!.querySelector('[data-slot=toc-top]')?.textContent).toBe('Contents')
    expect(panel()!.querySelector('[data-slot=toc-bottom]')?.textContent).toBe('Back to top')
  })
})

describe('Toc links', () => {
  it('flattens links in document order with their nesting level', () => {
    expect(flattenLinks(links).map(({ link, level }) => `${link.id}:${level}`)).toEqual([
      'packing:0',
      'route:0',
      'day-one:1',
      'day-two:1',
      'camp:0',
    ])
  })

  it('draws the circuit rail along the nesting', () => {
    const { path, height } = createCircuitPath([0, 1, 0])

    expect(height).toBe(84)
    expect(path).toBe('M0.5 0 L0.5 22 L10.5 34 L10.5 50 L0.5 62 L0.5 84')
  })
})
