import type { Component, PropType, VNode } from 'vue'
import { defineComponent, getCurrentInstance, h } from 'vue'

import type { LinkBaseProps } from '@/types/link'
import { warn } from '@/utils/warn'

/** What `LinkResolver` resolves: the link fields plus an optional element or component to render as. */
export type LinkTarget = LinkBaseProps & {
  /** The element or component to render the link as, e.g. a router link component. */
  as?: string | Component
}

/** The resolved link, handed to `LinkResolver`'s default slot. */
export type ResolvedLink = {
  /** The tag or component to render the link as. */
  as: string | Component
  /** Whether the link is the current location (`active`, else the router's match). */
  active: boolean
  /** Attributes and listeners for the rendered element. Undefined entries are dropped. */
  attrs: Record<string, unknown>
}

type RouterLinkSlotProps = {
  href: string
  isActive: boolean
  isExactActive: boolean
  navigate: (event: MouseEvent) => unknown
}

type RouteLocation = Exclude<LinkBaseProps['to'], string | undefined>

// The part of vue-router's `Router` the resolver uses, so vue-router stays optional.
type Router = { resolve: (to: RouteLocation) => { href: string } }

/** Whether a link has a destination: `to` or `href`. */
export const hasLink = (link: { to?: unknown; href?: unknown }): boolean =>
  link.to !== undefined || link.href !== undefined

/** The link fields of a component's props (plus `as`), for `LinkResolver`'s `link`. */
export const pickLinkProps = (props: LinkTarget): LinkTarget => ({
  as: props.as,
  to: props.to,
  href: props.href,
  target: props.target,
  rel: props.rel,
  download: props.download,
  external: props.external,
  replace: props.replace,
  exact: props.exact,
  active: props.active,
  disabled: props.disabled,
})

/**
 * `withDefaults` entries for the optional link booleans. Vue casts an absent boolean prop to `false`, which would
 * override the router's active match (`active`) and render `download="false"`; `undefined` leaves them unset.
 */
export const LINK_PROP_DEFAULTS = {
  download: undefined,
  external: undefined,
  replace: undefined,
  exact: undefined,
  active: undefined,
} as const

const omitUndefined = (attrs: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined))
}

// A protocol (`https:`, `mailto:`, …) or a protocol-relative `//` URL.
const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

/** Whether `to` must bypass the router: `external`, a new-tab `target`, or an absolute URL string. */
const isExternal = (link: LinkTarget): boolean =>
  !!link.external ||
  link.target === '_blank' ||
  (typeof link.to === 'string' && ABSOLUTE_URL.test(link.to))

// `href` wins; a route location object needs the router to become a URL.
const resolveHref = (link: LinkTarget, router: Router | undefined): string | undefined => {
  if (link.href !== undefined) return link.href

  const to = link.to
  if (to === undefined || typeof to === 'string') return to
  if (router) return router.resolve(to).href

  warn('A route location `to` needs vue-router installed; the link renders without an href.')

  return undefined
}

/**
 * Resolves a link's fields (`to`, `href`, `as`, `target`, ...) into what to render. When the app has vue-router
 * installed (a global `RouterLink`), an internal `to` goes through it, so navigation is client-side and `active`
 * follows the route; otherwise `to`/`href` render a plain anchor (a route location object gets its URL from the
 * router), and a link with neither renders `fallback`. A disabled link drops `href`, renders a plain anchor even with a
 * custom `as` when it has a destination (so it never navigates) and gets `aria-disabled="true"`; the current link
 * (explicit `active: true`, else the router's exact match) gets `aria-current="page"` unless `current` is off. Renders
 * nothing itself: it only calls its default slot with a `ResolvedLink`, and returns a single slot node as its root so
 * attributes fall through to it.
 */
export const LinkResolver = defineComponent({
  name: 'LinkResolver',
  props: {
    /** The link fields to resolve. */
    link: { type: Object as PropType<LinkTarget>, required: true },
    /** Ignore the link fields and resolve to `fallback` (e.g. a menu item that toggles its children). */
    button: { type: Boolean, default: false },
    /** The element rendered without a link. A `button` gets `type="button"` and the native `disabled`. */
    fallback: { type: String, default: 'button' },
    /**
     * Whether the current link gets `aria-current="page"`: an explicit `active: true`, else the router's exact match.
     * Off where the consumer owns `aria-current` or `active` means something else.
     */
    current: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const appContext = getCurrentInstance()?.appContext
    const RouterLink = appContext?.components.RouterLink

    // `app.use(router)` exposes the router as `$router`
    const router = appContext?.config.globalProperties.$router as Router | undefined

    return (): VNode | VNode[] | undefined => {
      const link = props.link
      const isDisabled = !!link.disabled
      const activeOverride = typeof link.active === 'boolean' ? link.active : undefined

      // A bare `download` keeps the URL's file name; `download="true"` would name the file "true".
      const common: Record<string, unknown> = {
        target: link.target,
        rel: link.rel ?? (link.target === '_blank' ? 'noopener noreferrer' : undefined),
        download: link.download === true ? '' : link.download || undefined,
        'aria-disabled': isDisabled ? 'true' : undefined,
      }

      const ariaCurrent = (isCurrent: boolean) => (props.current && isCurrent ? 'page' : undefined)

      // Undefined attributes are dropped: an explicit `undefined` would override attributes a wrapping component sets
      // (e.g. `aria-current`, `data-active`) when merged.
      const render = (resolved: ResolvedLink) => {
        const nodes = slots.default?.({ ...resolved, attrs: omitUndefined(resolved.attrs) })

        return nodes?.length === 1 ? nodes[0] : nodes
      }

      const renderFallback = () =>
        render({
          as: props.fallback,
          active: activeOverride ?? false,
          attrs:
            props.fallback === 'button'
              ? { type: 'button', disabled: isDisabled || undefined }
              : {},
        })

      if (props.button) return renderFallback()

      const to = link.to

      // A disabled custom component with a destination (a router or framework link) would still navigate, so it gets
      // the plain anchor; without one (e.g. a `span`) it stays as is.
      if (link.as && link.as !== 'a' && link.as !== 'button' && !(isDisabled && hasLink(link))) {
        return render({
          as: link.as,
          active: activeOverride ?? false,
          attrs: {
            ...common,
            to,
            href: link.href,
            replace: link.replace,
            external: link.external,
            'aria-current': ariaCurrent(activeOverride === true),
          },
        })
      }

      if (to !== undefined && RouterLink && !isDisabled && !isExternal(link)) {
        return h(
          RouterLink,
          { to, replace: link.replace, custom: true },
          {
            default: (route: RouterLinkSlotProps) =>
              render({
                as: 'a',
                active: activeOverride ?? (link.exact ? route.isExactActive : route.isActive),
                attrs: {
                  ...common,
                  href: route.href,
                  'aria-current': ariaCurrent(activeOverride ?? route.isExactActive),
                  onClick: (event: MouseEvent) => route.navigate(event),
                },
              }),
          },
        )
      }

      const href = resolveHref(link, router)
      const isAnchor = href !== undefined || link.as === 'a' || (isDisabled && hasLink(link))

      if (isAnchor) {
        return render({
          as: 'a',
          active: activeOverride ?? false,
          attrs: {
            ...common,
            href: isDisabled ? undefined : href,
            role: isDisabled ? 'link' : undefined,
            'aria-current': ariaCurrent(activeOverride === true),
          },
        })
      }

      return renderFallback()
    }
  },
})
