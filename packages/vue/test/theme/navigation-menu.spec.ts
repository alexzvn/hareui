import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import type { NavigationMenuProps } from '@/components/navigation-menu/NavigationMenu.types'
import NavigationMenu from '@/components/navigation-menu/NavigationMenu.vue'

const mounted: { unmount: () => void }[] = []

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

const mountMenu = (props: NavigationMenuProps) => {
  const wrapper = mount(NavigationMenu, { props, attachTo: document.body })
  mounted.push(wrapper)

  return wrapper
}

describe('NavigationMenu theme', () => {
  it('renders a string icon as a class on the leading icon span', () => {
    const menu = mountMenu({ items: [{ label: 'Inbox', icon: 'i-test-inbox' }] })
    expect(menu.get('[data-slot=linkLeadingIcon]').classes()).toContain('i-test-inbox')
  })

  it('applies the active colour and the highlight line only to the active item', () => {
    const menu = mountMenu({
      color: 'accent',
      highlight: true,
      highlightColor: 'success',
      items: [
        { label: 'A', href: '#a' },
        { label: 'B', href: '#b', active: true },
      ],
    })

    const [a, b] = menu.findAll('a')
    expect(b!.classes()).toContain('text-accent')
    expect(b!.classes()).toContain('after:bg-success')
    expect(a!.classes()).not.toContain('text-accent')
    expect(a!.classes()).not.toContain('after:bg-success')
  })

  it('merges `class` and per-item `ui` into the item link', () => {
    const menu = mountMenu({
      items: [{ label: 'A', href: '#a', class: 'item-class', ui: { link: 'item-ui' } }],
    })

    const link = menu.get('a')
    expect(link.classes()).toContain('item-class')
    expect(link.classes()).toContain('item-ui')
  })

  it('draws the highlight line on the active child of nested levels', async () => {
    const menu = mountMenu({
      orientation: 'vertical',
      highlight: true,
      items: [
        {
          label: 'Guide',
          defaultOpen: true,
          children: [{ label: 'Introduction', href: '#i', active: true }],
        },
      ],
    })

    await flushPromises()
    const child = menu.findAll('a').find((a) => a.text() === 'Introduction')!
    expect(child.classes()).toContain('after:bg-foreground')
  })

  it('hides labels when collapsed', () => {
    const menu = mountMenu({
      orientation: 'vertical',
      collapsed: true,
      items: [{ label: 'Home', icon: 'i-test-home', href: '#home' }],
    })

    expect(menu.get('[data-slot=linkLabel]').classes()).toContain('hidden')
  })

  it("keeps the row highlighted and its actions visible while the row's menu is open", async () => {
    mountMenu({
      orientation: 'vertical',
      items: [{ label: 'Reports', href: '#reports', actions: [{ value: 'open', label: 'Open' }] }],
    })

    await flushPromises()
    const row = document.querySelector('[data-slot=linkRow]')!

    // The link's fill follows an expanded trigger inside its row's actions (the CSS `:has()` the class compiles
    // to; jsdom's `:has` mishandles descendant combinators, so the behavior spec queries the row instead).
    expect(row.querySelector('[data-slot=link]')!.classList).toContain(
      'group-has-[[data-slot=linkActions]_[aria-expanded=true]]/row:bg-default',
    )

    expect(row.querySelector('[data-slot=linkActions]')!.classList).toContain(
      'has-aria-expanded:opacity-100',
    )
  })

  it('renders action entry icons, danger ones in red', async () => {
    mountMenu({
      orientation: 'vertical',
      items: [
        {
          label: 'Reports',
          href: '#r',
          actions: [
            { value: 'open', label: 'Open', icon: 'i-test-open' },
            { value: 'delete', label: 'Delete', icon: 'i-test-trash', variant: 'danger' },
          ],
        },
      ],
    })

    await flushPromises()
    document.querySelector<HTMLElement>('[aria-label="More actions for Reports"]')!.click()
    await flushPromises()
    const [open, trash] = [...document.querySelectorAll('[data-slot=linkActionsItemIcon]')]
    expect(open!.classList).toContain('i-test-open')
    expect(open!.classList).toContain('text-muted')
    expect(trash!.classList).toContain('i-test-trash')
    expect(trash!.classList).toContain('text-danger')
    expect(trash!.classList).not.toContain('text-muted')
  })
})
