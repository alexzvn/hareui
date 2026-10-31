import type { Component, PropType, VNode } from 'vue'
import { defineComponent, getCurrentInstance, h } from 'vue'

import type { LinkBaseProps } from '@/types/link'

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

const defined = (attrs: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined))
}

// A protocol (`https:`, `mailto:`, …) or a protocol-relative `//` URL.
const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

/** Whether `to` must bypass the router: `external`, a new-tab `target`, or an absolute URL string. */
const isExternal = (link: LinkTarget): boolean =>
  !!link.external ||
  link.target === '_blank' ||
  (typeof link.to === 'string' && ABSOLUTE_URL.test(link.to))

/**
 * Resolves a link's fields (`to`, `href`, `as`, `target`, ...) into what to render. When the app has vue-router
 * installed (a global `RouterLink`), an internal `to` goes through it, so navigation is client-side and `active`
 * follows the route; otherwise `to`/`href` render a plain anchor, and a link with neither renders `fallback`. A
 * disabled link drops `href` and gets `aria-disabled="true"`; the current link (explicit `active: true`, else the
 * router's exact match) gets `aria-current="page"` unless `current` is off. Renders nothing itself: it only calls its
 * default slot with a `ResolvedLink`, and returns a single slot node as its root so attributes fall through to it.
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
    const RouterLink = getCurrentInstance()?.appContext.components.RouterLink

    return (): VNode | VNode[] | undefined => {
      const link = props.link
      const isDisabled = !!link.disabled
      const explicit = typeof link.active === 'boolean' ? link.active : undefined

      const common: Record<string, unknown> = {
        target: link.target,
        rel: link.rel ?? (link.target === '_blank' ? 'noopener noreferrer' : undefined),
        download: link.download,
        'aria-disabled': isDisabled ? 'true' : undefined,
      }

      const ariaCurrent = (isCurrent: boolean) => (props.current && isCurrent ? 'page' : undefined)

      // Undefined attributes are dropped: an explicit `undefined` would override attributes a wrapping component sets
      // (e.g. `aria-current`, `data-active`) when merged.
      const render = (resolved: ResolvedLink) => {
        const nodes = slots.default?.({ ...resolved, attrs: defined(resolved.attrs) })

        return nodes?.length === 1 ? nodes[0] : nodes
      }

      const renderFallback = () =>
        render({
          as: props.fallback,
          active: explicit ?? false,
          attrs:
            props.fallback === 'button'
              ? { type: 'button', disabled: isDisabled || undefined }
              : {},
        })

      if (props.button) return renderFallback()

      const to = link.to
      const href = link.href ?? (typeof to === 'string' ? to : undefined)

      if (link.as && link.as !== 'a' && link.as !== 'button') {
        return render({
          as: link.as,
          active: explicit ?? false,
          attrs: {
            ...common,
            ...(to !== undefined ? { to } : {}),
            href: isDisabled ? undefined : link.href,
            'aria-current': ariaCurrent(explicit === true),
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
                active: explicit ?? (link.exact ? route.isExactActive : route.isActive),
                attrs: {
                  ...common,
                  href: route.href,
                  'aria-current': ariaCurrent(explicit ?? route.isExactActive),
                  onClick: (event: MouseEvent) => route.navigate(event),
                },
              }),
          },
        )
      }

      if (href !== undefined || link.as === 'a') {
        return render({
          as: 'a',
          active: explicit ?? false,
          attrs: {
            ...common,
            href: isDisabled ? undefined : href,
            role: isDisabled ? 'link' : undefined,
            'aria-current': ariaCurrent(explicit === true),
          },
        })
      }

      return renderFallback()
    }
  },
})
