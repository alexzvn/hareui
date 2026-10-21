import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import NavigationMenu from '../src/components/navigation-menu/NavigationMenu.vue'

type Props = Record<string, unknown>

let wrapper: VueWrapper | undefined

function mountMenu(props: Props, slots: Record<string, (props: never) => unknown> = {}, global: Props = {}): VueWrapper {
  // The generic SFC's prop types can't be inferred from a plain record; cast at the mount boundary only.
  const mounted = mount(NavigationMenu as unknown as Parameters<typeof mount>[0], { props, slots, global, attachTo: document.body }) as VueWrapper
  wrapper = mounted
  return mounted
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

// The text of every open tooltip (Reka renders a visually hidden role=tooltip copy of the content).
function tooltips() {
  return [...document.querySelectorAll('[role=tooltip]')].map(el => el.textContent?.trim())
}

function press(el: Element, key: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

const children = [
  { label: 'Introduction', description: 'Get started' },
  { label: 'Installation', description: 'Set it up' },
]

describe('NavigationMenu items', () => {
  it('renders items with an href as anchors and the others as buttons', () => {
    const menu = mountMenu({ items: [{ label: 'Docs', href: '/docs' }, { label: 'Action' }] })
    const anchor = menu.get('a')
    expect(anchor.attributes('href')).toBe('/docs')
    expect(anchor.text()).toBe('Docs')
    const button = menu.get('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Action')
  })

  it('marks only the item with `active` as the current page', () => {
    const menu = mountMenu({ items: [{ label: 'A', href: '#a' }, { label: 'B', href: '#b', active: true }] })
    const links = menu.findAll('a')
    expect(links[0]!.attributes('aria-current')).toBeUndefined()
    expect(links[1]!.attributes('aria-current')).toBe('page')
  })

  it('calls onSelect when an item is clicked, but not for a disabled one', async () => {
    const onSelect = vi.fn()
    const onDisabled = vi.fn()
    const menu = mountMenu({
      items: [
        { label: 'Enabled', onSelect },
        { label: 'Disabled', href: '#d', disabled: true, onSelect: onDisabled },
      ],
    })
    await menu.get('button').trigger('click')
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0]![0]).toBeInstanceOf(Event)

    const disabled = menu.get('a')
    expect(disabled.attributes('aria-disabled')).toBe('true')
    expect(disabled.attributes('href')).toBeUndefined()
    await disabled.trigger('click')
    expect(onDisabled).not.toHaveBeenCalled()
  })

  it('renders a disabled button item as a disabled button', () => {
    const menu = mountMenu({ items: [{ label: 'Off', disabled: true }] })
    expect(menu.get('button').attributes('disabled')).toBeDefined()
  })

  it('adds rel and the external icon to target="_blank" items, and hides the icon with external-icon=false', () => {
    const items = [{ label: 'Out', href: 'https://example.com', target: '_blank' }]
    const menu = mountMenu({ items })
    expect(menu.get('a').attributes('rel')).toBe('noopener noreferrer')
    expect(menu.find('[data-slot=linkLabelExternalIcon]').exists()).toBe(true)
    menu.unmount()

    const without = mountMenu({ items, externalIcon: false })
    expect(without.find('[data-slot=linkLabelExternalIcon]').exists()).toBe(false)
  })

  it('renders badge, kbds and a string icon as a class on an empty span', () => {
    const menu = mountMenu({ items: [{ label: 'Inbox', icon: 'i-test-inbox', badge: 3, kbds: ['command', 'K'] }] })
    expect(menu.get('[data-slot=linkLeadingIcon]').classes()).toContain('i-test-inbox')
    expect(menu.get('[data-slot=linkTrailingBadge]').text()).toBe('3')
    const kbd = menu.get('[data-slot=linkTrailingKbd]')
    expect(kbd.get('abbr').text()).toBe('⌘')
    expect(kbd.text()).toContain('K')
  })

  it('renders a 0 badge', () => {
    const menu = mountMenu({ items: [{ label: 'Inbox', badge: 0 }] })
    expect(menu.get('[data-slot=linkTrailingBadge]').text()).toBe('0')
  })

  it('applies the active colour and the highlight line only to the active item', () => {
    const menu = mountMenu({
      color: 'accent',
      highlight: true,
      highlightColor: 'success',
      items: [{ label: 'A', href: '#a' }, { label: 'B', href: '#b', active: true }],
    })
    const [a, b] = menu.findAll('a')
    expect(b!.classes()).toContain('text-accent')
    expect(b!.classes()).toContain('after:bg-success')
    expect(a!.classes()).not.toContain('text-accent')
    expect(a!.classes()).not.toContain('after:bg-success')
  })

  it('merges `class` and per-item `ui` into the item link', () => {
    const menu = mountMenu({ items: [{ label: 'A', href: '#a', class: 'item-class', ui: { link: 'item-ui' } }] })
    const link = menu.get('a')
    expect(link.classes()).toContain('item-class')
    expect(link.classes()).toContain('item-ui')
  })

  it('renders groups with a separator between them', () => {
    const menu = mountMenu({
      orientation: 'vertical',
      items: [[{ label: 'A' }], [{ label: 'B' }], [{ label: 'C' }]],
    })
    expect(menu.findAll('[data-slot=list]')).toHaveLength(3)
    expect(menu.findAll('[role=separator]')).toHaveLength(2)
  })

  it('renders `type: label` items as headings in the vertical menu only', () => {
    const items = [{ label: 'Section', type: 'label' }, { label: 'Item', href: '#i' }]
    const vertical = mountMenu({ orientation: 'vertical', items })
    expect(vertical.get('[data-slot=label]').text()).toBe('Section')
    vertical.unmount()

    const horizontal = mountMenu({ items })
    expect(horizontal.find('[data-slot=label]').exists()).toBe(false)
  })
})

describe('NavigationMenu slots', () => {
  it('#item-label replaces the label and receives the item and its active state', () => {
    const menu = mountMenu(
      { items: [{ label: 'A', href: '#a' }, { label: 'B', href: '#b', active: true }] },
      { 'item-label': ({ item, active }: { item: { label: string }, active: boolean }) => h('em', `${item.label}:${active}`) },
    )
    expect(menu.findAll('em').map(e => e.text())).toEqual(['A:false', 'B:true'])
  })

  it('an item `slot` uses its own named slots instead of the generic ones', () => {
    const menu = mountMenu(
      { items: [{ label: 'Plain', href: '#p' }, { label: 'Special', href: '#s', slot: 'special' }] },
      {
        'item-label': () => h('em', 'generic'),
        'special-label': () => h('strong', 'custom'),
        'special-trailing': () => h('i', 'trail'),
      },
    )
    expect(menu.findAll('em').map(e => e.text())).toEqual(['generic'])
    expect(menu.get('strong').text()).toBe('custom')
    expect(menu.get('[data-slot=linkTrailing]').text()).toBe('trail')
  })

  it('renders list-leading and list-trailing around the lists', () => {
    const menu = mountMenu(
      { items: [{ label: 'A' }] },
      { 'list-leading': () => h('span', { id: 'lead' }), 'list-trailing': () => h('span', { id: 'trail' }) },
    )
    const html = menu.html()
    expect(html.indexOf('id="lead"')).toBeLessThan(html.indexOf('<ul'))
    expect(html.indexOf('id="trail"')).toBeGreaterThan(html.indexOf('</ul>'))
  })
})

describe('NavigationMenu router links', () => {
  // A minimal vue-router RouterLink: it renders nothing itself and hands the link state to its slot.
  function routerStub(navigate: (to: unknown) => void) {
    return defineComponent({
      props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
      setup(props, { slots }) {
        return () => slots.default?.({
          href: `/app${props.to}`,
          isActive: props.to === '/b' || props.to === '/b/child',
          isExactActive: props.to === '/b',
          navigate: () => navigate(props.to),
        })
      },
    })
  }

  it('routes `to` through RouterLink: href, router-derived active state and navigation', async () => {
    const navigate = vi.fn()
    const menu = mountMenu(
      { items: [{ label: 'A', to: '/a' }, { label: 'B', to: '/b' }] },
      {},
      { components: { RouterLink: routerStub(navigate) } },
    )
    const [a, b] = menu.findAll('a')
    expect(a!.attributes('href')).toBe('/app/a')
    expect(a!.attributes('aria-current')).toBeUndefined()
    expect(b!.attributes('aria-current')).toBe('page')

    await a!.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/a')
  })

  it('an explicit `active` beats the router, and `exact` ignores partially matching routes', () => {
    const menu = mountMenu(
      {
        items: [
          { label: 'Forced off', to: '/b', active: false },
          { label: 'Partial', to: '/b/child' },
          { label: 'Exact', to: '/b/child', exact: true },
        ],
      },
      {},
      { components: { RouterLink: routerStub(vi.fn()) } },
    )
    const [forcedOff, partial, exact] = menu.findAll('a')
    expect(forcedOff!.attributes('data-active')).toBeUndefined()
    expect(forcedOff!.attributes('aria-current')).toBeUndefined()
    expect(partial!.attributes('data-active')).toBe('')
    expect(exact!.attributes('data-active')).toBeUndefined()
  })

  it('without a router a string `to` renders a plain anchor', () => {
    const menu = mountMenu({ items: [{ label: 'A', to: '/a' }] })
    expect(menu.get('a').attributes('href')).toBe('/a')
  })
})

describe('NavigationMenu vertical', () => {
  const items = [
    { label: 'Guide', children },
    { label: 'Other', children: [{ label: 'Elsewhere' }] },
  ]

  it('expands and collapses an item with children and emits the open values', async () => {
    const menu = mountMenu({ orientation: 'vertical', items })
    expect(menu.text()).not.toContain('Introduction')

    const trigger = menu.findAll('button')[0]!
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(menu.text()).toContain('Introduction')
    expect(menu.text()).toContain('Installation')
    expect(menu.emitted('update:modelValue')?.at(-1)).toEqual([['item-0']])

    await trigger.trigger('click')
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(menu.text()).not.toContain('Introduction')
    expect(menu.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('opens items flagged `defaultOpen` initially', async () => {
    const menu = mountMenu({ orientation: 'vertical', items: [{ label: 'Guide', defaultOpen: true, children }, items[1]] })
    await flushPromises()
    expect(menu.text()).toContain('Introduction')
    expect(menu.text()).not.toContain('Elsewhere')
  })

  it('keeps several items open with type=multiple but only one with type=single', async () => {
    const multiple = mountMenu({ orientation: 'vertical', items })
    for (const button of multiple.findAll('button'))
      await button.trigger('click')
    await flushPromises()
    expect(multiple.text()).toContain('Introduction')
    expect(multiple.text()).toContain('Elsewhere')
    multiple.unmount()

    const single = mountMenu({ orientation: 'vertical', type: 'single', items })
    // Top-level triggers only: once Guide opens, its children render as buttons too.
    const triggers = () => single.findAll('[data-slot=item] > button')
    await triggers()[0]!.trigger('click')
    await flushPromises()
    await triggers()[1]!.trigger('click')
    await flushPromises()
    expect(single.text()).not.toContain('Introduction')
    expect(single.text()).toContain('Elsewhere')
    expect(single.emitted('update:modelValue')?.at(-1)).toEqual(['item-1'])
  })

  it('is controlled by v-model through the item values', async () => {
    const menu = mountMenu({
      orientation: 'vertical',
      modelValue: ['group'],
      items: [{ label: 'Guide', value: 'group', children }, items[1]],
    })
    await flushPromises()
    expect(menu.text()).toContain('Introduction')

    await menu.setProps({ modelValue: [] })
    await flushPromises()
    expect(menu.text()).not.toContain('Introduction')
  })

  it('animates the nested list open and closed, keeping the rows until the collapse ends', async () => {
    // happy-dom has no layout: give the list a height and record the Web Animations it runs.
    const calls: { keyframes: Keyframe[], options: KeyframeAnimationOptions, finish: () => void }[] = []
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return { height: this.dataset.slot === 'content' && this.childElementCount ? 80 : 0 } as DOMRect
    })
    const animate = vi.spyOn(HTMLElement.prototype, 'animate').mockImplementation((keyframes, options) => {
      let finish!: () => void
      const finished = new Promise<void>(resolve => (finish = resolve))
      calls.push({ keyframes: keyframes as Keyframe[], options: options as KeyframeAnimationOptions, finish })
      return { finished, cancel() {} } as unknown as Animation
    })
    try {
      const menu = mountMenu({ orientation: 'vertical', items: [{ label: 'Guide', defaultOpen: true, children }] })
      await flushPromises()
      expect(calls).toHaveLength(0)
      const trigger = menu.get('[data-slot=item] > button')
      const content = () => menu.find('[data-slot=content]')

      await trigger.trigger('click')
      await flushPromises()
      expect(calls.map(c => [c.keyframes, c.options.duration])).toEqual([
        [[{ height: '80px' }, { height: '0px' }], 180],
        [[{ opacity: 1 }, { opacity: 0 }], 100],
      ])
      expect(content().attributes('data-state')).toBe('closed')
      expect(content().attributes('style')).toContain('overflow: clip')
      expect(menu.text()).toContain('Introduction')

      calls.splice(0).forEach(c => c.finish())
      await flushPromises()
      expect(menu.text()).not.toContain('Introduction')

      await trigger.trigger('click')
      await flushPromises()
      expect(calls.map(c => c.keyframes)).toEqual([
        [{ height: '0px' }, { height: '80px' }],
        [{ opacity: 0 }, { opacity: 1 }],
      ])
      expect(menu.text()).toContain('Introduction')
      calls.splice(0).forEach(c => c.finish())
      await flushPromises()
      expect(content().attributes('style') ?? '').not.toContain('overflow')

      // Reduced motion switches at once.
      menu.element.setAttribute('data-reduce-motion', 'true')
      await trigger.trigger('click')
      await flushPromises()
      expect(calls).toHaveLength(0)
      expect(menu.text()).not.toContain('Introduction')
    }
    finally {
      rect.mockRestore()
      animate.mockRestore()
    }
  })

  it('a link with children and an href toggles from its chevron only, without navigating', async () => {
    const onSelect = vi.fn()
    const menu = mountMenu({ orientation: 'vertical', items: [{ label: 'Guide', href: '#guide', children, onSelect }] })
    const chevron = menu.get('[data-slot=linkTrailing]')
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    chevron.element.dispatchEvent(click)
    await flushPromises()
    expect(click.defaultPrevented).toBe(true)
    expect(onSelect).not.toHaveBeenCalled()
    expect(menu.text()).toContain('Introduction')

    await menu.get('a').trigger('click')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('type "trigger" turns an item with an href into a collapsible button', async () => {
    const menu = mountMenu({ orientation: 'vertical', items: [{ label: 'Guide', href: '#guide', type: 'trigger', children }] })
    expect(menu.find('a').exists()).toBe(false)
    await menu.get('button').trigger('click')
    await flushPromises()
    expect(menu.text()).toContain('Introduction')
  })

  it('does not toggle disabled items', async () => {
    const menu = mountMenu({ orientation: 'vertical', items: [{ label: 'Guide', disabled: true, children }] })
    await menu.get('button').trigger('click')
    await flushPromises()
    expect(menu.text()).not.toContain('Introduction')
  })

  it('highlights the active child with the highlight line on nested levels', async () => {
    const menu = mountMenu({
      orientation: 'vertical',
      highlight: true,
      items: [{ label: 'Guide', defaultOpen: true, children: [{ label: 'Introduction', href: '#i', active: true }] }],
    })
    await flushPromises()
    const child = menu.findAll('a').find(a => a.text() === 'Introduction')!
    expect(child.attributes('aria-current')).toBe('page')
    expect(child.classes()).toContain('after:bg-foreground')
  })
})

describe('NavigationMenu collapsed', () => {
  const items = [
    { label: 'Home', icon: 'i-test-home', href: '#home' },
    { label: 'Guide', icon: 'i-test-guide', children },
  ]

  it('hides labels and trailing content and does not render nested children inline', () => {
    const menu = mountMenu({ orientation: 'vertical', collapsed: true, items })
    expect(menu.get('[data-slot=linkLabel]').classes()).toContain('hidden')
    expect(menu.text()).not.toContain('Introduction')
    expect(menu.attributes('data-collapsed')).toBe('true')
  })

  it('shows a tooltip with the label when `tooltip` is set', async () => {
    mountMenu({ orientation: 'vertical', collapsed: true, tooltip: { defaultOpen: true, delay: 0 }, items })
    await flushPromises()
    expect(tooltips()).toEqual(['Home', 'Guide'])
  })

  it('a tooltip on one item shows regardless of the global prop', async () => {
    mountMenu({
      orientation: 'vertical',
      collapsed: true,
      items: [{ label: 'Home', icon: 'i-test-home', tooltip: { text: 'Go home', defaultOpen: true } }, { label: 'Other', icon: 'i-test-other' }],
    })
    await flushPromises()
    expect(tooltips()).toEqual(['Go home'])
  })

  it('opens the children of an item in a click popover', async () => {
    const menu = mountMenu({ orientation: 'vertical', collapsed: true, popover: { mode: 'click' }, items })
    const trigger = menu.findAll('button')[0]!
    await trigger.trigger('click')
    await flushPromises()
    const popover = document.querySelector('[data-slot=popover]')
    expect(popover).not.toBeNull()
    expect(popover!.textContent).toContain('Guide')
    expect(popover!.textContent).toContain('Introduction')
    expect(popover!.textContent).toContain('Installation')
  })

  it('renders the #item-content slot inside the popover and passes `close`', async () => {
    const menu = mountMenu(
      { orientation: 'vertical', collapsed: true, popover: { mode: 'click' }, items },
      { 'item-content': ({ item }: { item: { label: string } }) => h('p', { id: 'custom' }, `custom ${item.label}`) },
    )
    await menu.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(document.querySelector('#custom')?.textContent).toBe('custom Guide')
  })

  it('without `popover`, items with children render no popover', async () => {
    const menu = mountMenu({ orientation: 'vertical', collapsed: true, items })
    await menu.findAll('button')[0]!.trigger('click')
    await flushPromises()
    expect(document.querySelector('[data-slot=popover]')).toBeNull()
  })

  it('opening a hover popover closes an open tooltip and the other popovers at once', async () => {
    const menu = mountMenu({
      orientation: 'vertical',
      collapsed: true,
      tooltip: true,
      popover: true,
      items: [
        { label: 'Home', icon: 'i-test-home', tooltip: { defaultOpen: true, delay: 0 } },
        { label: 'Guide', icon: 'i-test-guide', children },
        { label: 'Docs', icon: 'i-test-docs', children },
      ],
    })
    await flushPromises()
    expect(tooltips()).toEqual(['Home'])
    const hover = async (index: number) => {
      menu.findAll('[data-slot=link]')[index]!.element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
      await new Promise(resolve => setTimeout(resolve, 10))
      await flushPromises()
    }
    await hover(1)
    expect(tooltips()).toEqual([])
    expect(document.querySelectorAll('[data-slot=popover][data-state=open]')).toHaveLength(1)
    await hover(2)
    const open = [...document.querySelectorAll('[data-slot=popover][data-state=open]')]
    expect(open).toHaveLength(1)
    expect(open[0]!.textContent).toContain('Docs')
  })
})

describe('NavigationMenu item actions', () => {
  const rowActions = [
    { value: 'open', label: 'Open', icon: 'i-test-open' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'delete', label: 'Delete', variant: 'danger' },
  ]
  const items = [
    { label: 'Dashboard', href: '#dashboard', actions: rowActions },
    {
      label: 'Analytics',
      defaultOpen: true,
      children: [
        { label: 'Overview', href: '#overview' },
        { label: 'Reports', href: '#reports', actions: rowActions },
      ],
    },
  ]

  const actionButton = (label: string) => document.querySelector<HTMLElement>(`[aria-label="More actions for ${label}"]`)
  const menuItem = (label: string) => [...document.querySelectorAll<HTMLElement>('[data-slot=menu-item]')].find(el => el.textContent?.includes(label))
  const menuOpen = () => document.querySelector('[data-slot=dropdown-popover]') !== null
  // The document's tab sequence: enabled links and buttons without a negative tabindex, in DOM order.
  const tabOrder = () => [...document.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(el => el.tabIndex >= 0)

  it('renders the action button as a sibling of the link at every level, never inside it', async () => {
    const menu = mountMenu({ orientation: 'vertical', items })
    await flushPromises()
    for (const label of ['Dashboard', 'Reports']) {
      const button = actionButton(label)!
      expect(button).not.toBeNull()
      const row = button.closest('[data-slot=linkRow]')!
      const link = row.querySelector('[data-slot=link]')!
      expect(link.textContent).toContain(label)
      expect(link.contains(button)).toBe(false)
      expect(button.closest('a, [data-slot=link]')).toBeNull()
    }
    // Rows without actions keep the plain structure.
    expect(menu.findAll('[data-slot=linkRow]')).toHaveLength(2)
  })

  it('is reached with Tab after its row, opens with Enter and Space, and Escape returns focus to it', async () => {
    mountMenu({ orientation: 'vertical', items })
    await flushPromises()
    const order = tabOrder()
    const reportsLink = order.find(el => el.getAttribute('href') === '#reports')!
    const button = actionButton('Reports')!
    expect(order.indexOf(button)).toBe(order.indexOf(reportsLink) + 1)

    for (const key of ['Enter', ' ']) {
      button.focus()
      press(button, key)
      await flushPromises()
      expect(menuOpen()).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('true')
      expect(document.activeElement).toBe(menuItem('Open'))

      press(document.activeElement!, 'Escape')
      await flushPromises()
      expect(menuOpen()).toBe(false)
      // Reka's focus scope hands focus back on a timer after the content unmounts.
      await vi.waitFor(() => expect(document.activeElement).toBe(button))
    }
  })

  it('keeps the row highlighted while its menu is open', async () => {
    mountMenu({ orientation: 'vertical', items })
    await flushPromises()
    const button = actionButton('Reports')!
    const row = button.closest('[data-slot=linkRow]')!
    const link = row.querySelector('[data-slot=link]')!
    // The link's fill follows an expanded trigger inside its row's actions (the CSS `:has()` the class compiles
    // to; jsdom's `:has` mishandles descendant combinators, so the same query runs from the row).
    const lit = 'group-has-[[data-slot=linkActions]_[aria-expanded=true]]/row:bg-default'
    const expanded = () => row.querySelector('[data-slot=linkActions] [aria-expanded=true]') !== null
    expect(link.classList).toContain(lit)
    expect(expanded()).toBe(false)

    button.click()
    await flushPromises()
    expect(menuOpen()).toBe(true)
    expect(expanded()).toBe(true)
    // The actions stay visible while the menu is open.
    expect(row.querySelector('[data-slot=linkActions]')!.classList).toContain('has-aria-expanded:opacity-100')

    press(menuItem('Open')!, 'Escape')
    await flushPromises()
    expect(expanded()).toBe(false)
  })

  it('calls the selected entry\'s onSelect and renders entry icons, danger ones in red', async () => {
    const onSelect = vi.fn()
    const actions = [
      { value: 'open', label: 'Open', icon: 'i-test-open' },
      { type: 'section', items: [{ value: 'duplicate', label: 'Duplicate', onSelect }] },
      { value: 'delete', label: 'Delete', icon: 'i-test-trash', variant: 'danger' },
    ]
    mountMenu({ orientation: 'vertical', items: [{ label: 'Reports', href: '#r', actions }] })
    await flushPromises()
    actionButton('Reports')!.click()
    await flushPromises()
    const [open, trash] = [...document.querySelectorAll('[data-slot=linkActionsItemIcon]')]
    expect(open!.classList).toContain('i-test-open')
    expect(open!.classList).toContain('text-muted')
    expect(trash!.classList).toContain('i-test-trash')
    expect(trash!.classList).toContain('text-danger')
    expect(trash!.classList).not.toContain('text-muted')
    menuItem('Duplicate')!.click()
    await flushPromises()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(menuOpen()).toBe(false)
  })

  it('renders the #item-actions and #<slot>-actions slots before the menu button', async () => {
    mountMenu(
      { orientation: 'vertical', items: [{ label: 'Dashboard', href: '#d', slot: 'dashboard', actions: rowActions }, { label: 'Inbox', href: '#i' }] },
      {
        'dashboard-actions': ({ item }: { item: { label: string } }) => h('button', { 'aria-label': `Notify ${item.label}` }),
        'item-actions': ({ item }: { item: { label: string } }) => h('button', { 'aria-label': `Pin ${item.label}` }),
      },
    )
    await flushPromises()
    const dashboard = actionButton('Dashboard')!.parentElement!
    expect([...dashboard.querySelectorAll('button')].map(b => b.getAttribute('aria-label'))).toEqual(['Notify Dashboard', 'More actions for Dashboard'])
    const inbox = document.querySelector('[aria-label="Pin Inbox"]')!
    expect(inbox.closest('[data-slot=linkActions]')).not.toBeNull()
    expect(document.querySelector('[aria-label="Pin Dashboard"]')).toBeNull()
  })

  it('renders on the server, with no #item-actions slot', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(NavigationMenu as never, { orientation: 'vertical', items }) }))
    expect(html).toContain('aria-label="More actions for Reports"')
    expect(html).toContain('data-slot="linkActions"')
  })

  it('renders no actions when collapsed or horizontal', async () => {
    const collapsed = mountMenu({ orientation: 'vertical', collapsed: true, items })
    await flushPromises()
    expect(collapsed.find('[data-slot=linkActions]').exists()).toBe(false)
    expect(collapsed.find('[data-slot=linkRow]').exists()).toBe(false)
    collapsed.unmount()

    const horizontal = mountMenu({ items })
    await flushPromises()
    expect(horizontal.find('[data-slot=linkActions]').exists()).toBe(false)
  })
})

describe('NavigationMenu horizontal', () => {
  const items = [
    { label: 'Guide', children },
    { label: 'GitHub', href: '#gh' },
    { label: 'Docs', href: '#docs' },
  ]

  it('opens the children of a trigger as dropdown content and closes them on a second click', async () => {
    const menu = mountMenu({ items })
    const trigger = menu.get('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(menu.text()).not.toContain('Get started')

    await trigger.trigger('click')
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('data-state')).toBe('open')
    expect(menu.text()).toContain('Introduction')
    expect(menu.text()).toContain('Get started')
    expect(menu.emitted('update:modelValue')?.at(-1)).toEqual(['item-0'])

    await trigger.trigger('click')
    await flushPromises()
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('opens the item named by v-model', async () => {
    const menu = mountMenu({ items, modelValue: 'item-0' })
    await flushPromises()
    expect(menu.text()).toContain('Get started')
    await menu.setProps({ modelValue: '' })
    await flushPromises()
    expect(menu.text()).not.toContain('Get started')
  })

  it('selecting a child calls its onSelect', async () => {
    const onSelect = vi.fn()
    const menu = mountMenu({
      items: [{ label: 'Guide', children: [{ label: 'Introduction', href: '#intro', onSelect }] }],
      modelValue: 'item-0',
    })
    await flushPromises()
    await menu.findAll('a').find(a => a.text() === 'Introduction')!.trigger('click')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('renders the #item-content slot as the dropdown content', async () => {
    const menu = mountMenu(
      { items, modelValue: 'item-0' },
      { 'item-content': ({ item }: { item: { label: string } }) => h('p', { id: 'custom' }, `custom ${item.label}`) },
    )
    await flushPromises()
    expect(menu.get('#custom').text()).toBe('custom Guide')
  })

  it('moves focus between items with the arrow keys, Home and End', async () => {
    const menu = mountMenu({ items: [{ label: 'One', href: '#1' }, { label: 'Two', href: '#2' }, { label: 'Three', href: '#3' }] })
    await flushPromises()
    const [one, two, three] = menu.findAll('a').map(a => a.element as HTMLElement)
    one!.focus()
    expect(document.activeElement).toBe(one)

    press(one!, 'ArrowRight')
    expect(document.activeElement).toBe(two)
    press(two!, 'ArrowRight')
    expect(document.activeElement).toBe(three)
    press(three!, 'ArrowLeft')
    expect(document.activeElement).toBe(two)
    press(two!, 'End')
    expect(document.activeElement).toBe(three)
    press(three!, 'Home')
    expect(document.activeElement).toBe(one)
  })

  it('shows a tooltip on an item with `tooltip` even when horizontal', async () => {
    mountMenu({ items: [{ label: 'Home', href: '#h', tooltip: { text: 'Go home', defaultOpen: true } }] })
    await nextTick()
    await flushPromises()
    expect(tooltips()).toEqual(['Go home'])
  })

  it('renders the arrow only when `arrow` is set', () => {
    const without = mountMenu({ items })
    expect(without.find('[data-slot=arrow]').exists()).toBe(false)
    without.unmount()
    // The indicator renders once a trigger is open; the viewport wrapper is always there.
    const withArrow = mountMenu({ items, arrow: true })
    expect(withArrow.find('[data-slot=viewportWrapper]').exists()).toBe(true)
  })
})
