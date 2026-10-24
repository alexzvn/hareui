import type { Component, PropType, VNode } from 'vue'
import { defineComponent, getCurrentInstance, h } from 'vue'

import type { NavigationMenuChildItem, NavigationMenuItem } from './NavigationMenu.types'

const defined = (attrs: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined))
}

export type ResolvedLink = {
  /** The tag or component to render the link as. */
  as: string | Component
  /** Whether the item is the current location (`item.active`, else the router's match). */
  active: boolean
  /** Attributes and listeners for the rendered element. */
  attrs: Record<string, unknown>
}

type RouterLinkSlotProps = {
  href: string
  isActive: boolean
  isExactActive: boolean
  navigate: (event: MouseEvent) => unknown
}

/**
 * Resolves an item's link props (`to`, `href`, `as`, `target`, ...) into what to render. When the
 * app has vue-router installed (a global `RouterLink`), `to` goes through it, so navigation is
 * client-side and `active` follows the route; otherwise `to`/`href` render a plain anchor and an
 * item with neither renders a button. Renders nothing itself: it only calls its default slot.
 */
export default defineComponent({
  name: 'NavigationMenuLinkResolver',
  props: {
    item: {
      type: Object as PropType<NavigationMenuItem | NavigationMenuChildItem>,
      required: true,
    },
    /** Ignore the item's link props and resolve to a plain button (used for `type: 'trigger'`). */
    button: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const RouterLink = getCurrentInstance()?.appContext.components.RouterLink

    return (): VNode[] | undefined => {
      const item = props.item
      const disabled = !!item.disabled
      const explicit = typeof item.active === 'boolean' ? item.active : undefined

      const common: Record<string, unknown> = {
        target: item.target,
        rel: item.rel ?? (item.target === '_blank' ? 'noopener noreferrer' : undefined),
        download: item.download,
        'aria-disabled': disabled ? 'true' : undefined,
      }

      // Undefined attributes are dropped: an explicit `undefined` would override the attributes Reka's link sets (`aria-current`, `data-active`) when merged.
      const render = (resolved: ResolvedLink) =>
        slots.default?.({ ...resolved, attrs: defined(resolved.attrs) })

      if (props.button)
        return render({
          as: 'button',
          active: explicit ?? false,
          attrs: { type: 'button', disabled: disabled || undefined },
        })

      const to = item.to
      const href = item.href ?? (typeof to === 'string' ? to : undefined)

      if (item.as && item.as !== 'a' && item.as !== 'button') {
        return render({
          as: item.as,
          active: explicit ?? false,
          attrs: {
            ...common,
            ...(to !== undefined ? { to } : {}),
            href: disabled ? undefined : item.href,
          },
        })
      }

      if (
        to !== undefined &&
        RouterLink &&
        !disabled &&
        !item.external &&
        item.target !== '_blank'
      ) {
        return [
          h(
            RouterLink,
            { to, replace: item.replace, custom: true },
            {
              default: (link: RouterLinkSlotProps) =>
                render({
                  as: 'a',
                  active: explicit ?? (item.exact ? link.isExactActive : link.isActive),
                  attrs: {
                    ...common,
                    href: link.href,
                    onClick: (event: MouseEvent) => link.navigate(event),
                  },
                }),
            },
          ),
        ]
      }

      if (href !== undefined || item.as === 'a') {
        return render({
          as: 'a',
          active: explicit ?? false,
          attrs: {
            ...common,
            href: disabled ? undefined : href,
            role: disabled ? 'link' : undefined,
          },
        })
      }

      return render({
        as: 'button',
        active: explicit ?? false,
        attrs: { type: 'button', disabled: disabled || undefined },
      })
    }
  },
})
