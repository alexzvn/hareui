import type { ClassValue } from 'tailwind-variants'
import type { ComputedRef, InjectionKey, Slots, VNode } from 'vue'
import { Comment, Fragment, h, inject } from 'vue'

import type { TooltipProps } from '@/components/tooltip/Tooltip.vue'

import type { NavigationMenuItem, NavigationMenuProps } from './NavigationMenu.vue'
import theme from './theme'
import type { NavigationMenuPopoverProps } from './types'

type Theme = typeof theme
type SlotName = keyof Theme['slots']
interface SlotArgs {
  class?: ClassValue
  active?: boolean
  disabled?: boolean
  level?: boolean
  actions?: boolean
  danger?: boolean
}

/** The resolved slot class functions; link slots take per-item variants on top of the root ones. */
export type NavigationMenuUI = Record<SlotName, (props?: SlotArgs) => string>

export interface NavigationMenuContext {
  props: NavigationMenuProps
  ui: ComputedRef<NavigationMenuUI>
  slots: Slots
  accordionProps: ComputedRef<Record<string, unknown>>
  tooltipProps: ComputedRef<TooltipProps>
  popoverProps: ComputedRef<NavigationMenuPopoverProps>
  getLabel: (item: NavigationMenuItem) => string | undefined
  getItemValue: (
    item: NavigationMenuItem,
    index: number,
    level: number,
    listIndex: number,
  ) => string
  getAccordionDefaultValue: (
    list: NavigationMenuItem[],
    level: number,
    listIndex: number,
  ) => string | string[] | undefined
  /**
   * Tracks the width of a row's actions container and writes the end padding its link needs
   * (`--navigation-menu-actions-inset` on the row). Returns the cleanup.
   */
  observeActions: (el: HTMLElement) => () => void
}

export const navigationMenuKey: InjectionKey<NavigationMenuContext> =
  Symbol('hareui-navigation-menu')

export function useNavigationMenu(): NavigationMenuContext {
  const context = inject(navigationMenuKey)
  if (!context) throw new Error('NavigationMenu parts must be used inside <NavigationMenu>')
  return context
}

/** Reads a (possibly dotted) path from an item (dotted-path getter). */
export function get(item: unknown, path: string): unknown {
  let value: unknown = item
  for (const key of path.split('.')) {
    if (value === null || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }
  return value
}

/** Whether rendered slot output has content (Vue's own rule for falling back to slot defaults). */
export function hasContent(nodes: VNode[] | undefined): boolean {
  return !!nodes?.some((node) =>
    node.type === Comment
      ? false
      : node.type === Fragment
        ? hasContent(node.children as VNode[])
        : true,
  )
}

/** Slot names an item resolves to: its own `slot` field, falling back to the generic one. */
export function slotName(
  item: NavigationMenuItem,
  suffix: '' | 'leading' | 'label' | 'trailing' | 'content' | 'actions',
): string {
  const base = item.slot || 'item'
  return suffix ? `${base}-${suffix}` : base
}

/**
 * Renders a named slot of the root `NavigationMenu` with this component's default slot as the
 * fallback, so the item templates can live in separate components.
 */
export function SlotOutlet(
  props: { name: string; slotProps?: Record<string, unknown> },
  { slots }: { slots: Slots },
) {
  const root = inject(navigationMenuKey)
  const render = root?.slots[props.name]
  if (render) {
    const nodes = render(props.slotProps ?? {})
    if (hasContent(nodes)) return nodes
  }
  // An empty array without a fallback: the server renderer can't render a Fragment with `null` children.
  return h(Fragment, null, slots.default?.() ?? [])
}
SlotOutlet.props = ['name', 'slotProps']
