import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import type { LinkTarget, ResolvedLink } from '@/utils/link'
import { LinkResolver } from '@/utils/link'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

// A minimal vue-router RouterLink: it renders nothing itself and hands the link state to its slot. Like vue-router's
// `custom` mode, a single slot node becomes its root, so attributes fall through to it.
const routerStub = (navigate: (to: unknown) => void) => {
  return defineComponent({
    props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
    setup(props, { slots }) {
      return () => {
        const nodes = slots.default?.({
          href: `/app${props.to}`,
          isActive: props.to === '/b' || props.to === '/b/child',
          isExactActive: props.to === '/b',
          navigate: () => navigate(props.to),
        })

        return nodes?.length === 1 ? nodes[0] : nodes
      }
    },
  })
}

// A router that records nothing: for checks that only read the rendered link.
const anyRouter = () => routerStub(vi.fn<(to: unknown) => void>())

type MountOptions = {
  fallback?: string
  current?: boolean
  attrs?: Record<string, unknown>
  RouterLink?: ReturnType<typeof routerStub>
}

const mountLink = (link: LinkTarget, options: MountOptions = {}) => {
  wrapper = mount(
    () =>
      h(
        LinkResolver,
        { link, fallback: options.fallback, current: options.current, ...options.attrs },
        {
          default: ({ as, active, attrs }: ResolvedLink) =>
            h(
              as,
              { ...attrs, 'data-active': active ? 'true' : undefined },
              { default: () => 'Go' },
            ),
        },
      ),
    { global: { components: options.RouterLink ? { RouterLink: options.RouterLink } : {} } },
  )

  return wrapper
}

describe('LinkResolver without a router', () => {
  it('renders a string `to` as a plain anchor', () => {
    const link = mountLink({ to: '/a' })
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/a')
  })

  it('renders `href` as a plain anchor', () => {
    const link = mountLink({ href: 'https://example.com' })
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('renders a `type="button"` button without `to` or `href`', () => {
    const link = mountLink({})
    expect(link.element.tagName).toBe('BUTTON')
    expect(link.attributes('type')).toBe('button')
  })

  it('renders the `fallback` element without `to` or `href`', () => {
    const link = mountLink({}, { fallback: 'div' })
    expect(link.element.tagName).toBe('DIV')
  })

  it('takes the active state from `active`', () => {
    const link = mountLink({ href: '/a', active: true })
    expect(link.attributes('data-active')).toBe('true')
  })
})

describe('LinkResolver with a router', () => {
  it('routes `to` through RouterLink: router href and client-side navigation', async () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const link = mountLink({ to: '/a' }, { RouterLink: routerStub(navigate) })

    expect(link.attributes('href')).toBe('/app/a')
    await link.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/a')
  })

  it('takes the active state from the route', () => {
    const link = mountLink({ to: '/b/child' }, { RouterLink: anyRouter() })
    expect(link.attributes('data-active')).toBe('true')
  })

  it('with `exact`, ignores a partially matching route', () => {
    const link = mountLink({ to: '/b/child', exact: true }, { RouterLink: anyRouter() })
    expect(link.attributes('data-active')).toBeUndefined()
  })

  it('lets an explicit `active` beat the route', () => {
    const link = mountLink({ to: '/b', active: false }, { RouterLink: anyRouter() })
    expect(link.attributes('data-active')).toBeUndefined()
  })

  it('keeps an `external` link off the router', () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const link = mountLink({ to: '/a', external: true }, { RouterLink: routerStub(navigate) })

    expect(link.attributes('href')).toBe('/a')
    expect(navigate).not.toHaveBeenCalled()
  })

  it('keeps an absolute URL `to` off the router', () => {
    const link = mountLink({ to: 'https://example.com' }, { RouterLink: anyRouter() })
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('keeps a `target="_blank"` link off the router', () => {
    const link = mountLink({ to: '/a', target: '_blank' }, { RouterLink: anyRouter() })
    expect(link.attributes('href')).toBe('/a')
  })
})

describe('LinkResolver link attributes', () => {
  it('sets `target` and a default `rel="noopener noreferrer"` on a new-tab link', () => {
    const link = mountLink({ href: 'https://example.com', target: '_blank', external: true })
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('keeps an explicit `rel`', () => {
    const link = mountLink({ href: 'https://example.com', target: '_blank', rel: 'external' })
    expect(link.attributes('rel')).toBe('external')
  })

  it('passes `download` through', () => {
    const link = mountLink({ href: '/report.pdf', download: 'report.pdf' })
    expect(link.attributes('download')).toBe('report.pdf')
  })

  it('a disabled link drops `href` and gets `aria-disabled` and the link role', () => {
    const link = mountLink({ href: '/a', disabled: true })
    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('role')).toBe('link')
  })

  it('a disabled `to` stays off the router', () => {
    const navigate = vi.fn<(to: unknown) => void>()
    const link = mountLink({ to: '/a', disabled: true }, { RouterLink: routerStub(navigate) })

    expect(link.attributes('href')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBe('true')
  })

  it('a disabled button gets the native `disabled`', () => {
    const link = mountLink({ disabled: true })
    expect(link.attributes('disabled')).toBeDefined()
  })

  it('renders a custom `as` with `to` and `href` as attributes', () => {
    const Custom = defineComponent({
      props: { to: String },
      setup:
        (props, { slots }) =>
        () =>
          h('span', { 'data-to': props.to }, slots.default?.()),
    })

    const link = mountLink({ as: Custom, to: '/a' })
    expect(link.attributes('data-to')).toBe('/a')
  })

  it('passes its own attributes through to the rendered link', () => {
    const link = mountLink({ to: '/a' }, { attrs: { 'data-index': 3 }, RouterLink: anyRouter() })

    expect(link.attributes('data-index')).toBe('3')
  })
})

describe('LinkResolver aria-current', () => {
  it('marks the exact route match with `aria-current="page"`', () => {
    const link = mountLink({ to: '/b' }, { RouterLink: anyRouter() })
    expect(link.attributes('aria-current')).toBe('page')
  })

  it('leaves a partially matching route without `aria-current`', () => {
    const link = mountLink({ to: '/b/child' }, { RouterLink: anyRouter() })
    expect(link.attributes('aria-current')).toBeUndefined()
  })

  it('lets an explicit `active: false` beat the exact route match', () => {
    const link = mountLink({ to: '/b', active: false }, { RouterLink: anyRouter() })
    expect(link.attributes('aria-current')).toBeUndefined()
  })

  it('marks an explicit `active: true` link without a router', () => {
    const link = mountLink({ href: '/a', active: true })
    expect(link.attributes('aria-current')).toBe('page')
  })

  it('leaves a link without `active` and without a router unmarked', () => {
    const link = mountLink({ href: '/a' })
    expect(link.attributes('aria-current')).toBeUndefined()
  })

  it('never marks the fallback element', () => {
    const link = mountLink({ active: true })
    expect(link.attributes('aria-current')).toBeUndefined()
  })

  it('with `current` off, leaves the exact route match unmarked', () => {
    const link = mountLink({ to: '/b' }, { RouterLink: anyRouter(), current: false })
    expect(link.attributes('aria-current')).toBeUndefined()
  })
})
