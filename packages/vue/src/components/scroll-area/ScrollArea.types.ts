import type { VirtualItem, Virtualizer, VirtualizerOptions } from '@tanstack/vue-virtual'
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ScrollArea = typeof theme

/** The resolved slot class functions of a `ScrollArea`. */
export type ScrollAreaUI = ComponentUI<ScrollArea>

/**
 * Options of the `virtualize` prop. Besides the fields below it takes any TanStack Virtual option except the ones the
 * component sets itself (`count`, `horizontal`, `isRtl`, `enabled`), such as `overscan` (12 by default), `gap`,
 * `paddingStart`, `paddingEnd`, `scrollMargin` and `getItemKey`.
 * @see https://tanstack.com/virtual/v3/docs/api/virtualizer#options
 */
export type ScrollAreaVirtualizeOptions = Partial<
  Omit<
    VirtualizerOptions<Element, Element>,
    'count' | 'horizontal' | 'isRtl' | 'estimateSize' | 'lanes' | 'enabled' | 'getScrollElement'
  >
> & {
  /**
   * Virtualize against an outer scroll element instead of the ScrollArea itself, which then grows to its full size.
   * Set `scrollMargin` to the distance from the start of that element to the start of the list.
   */
  getScrollElement?: () => Element | null
  /**
   * The estimated size in px of each item along the scroll axis, or a function of the item index.
   * @defaultValue 100
   */
  estimateSize?: number | ((index: number) => number)
  /** The number of columns (vertical) or rows (horizontal) the items are laid out in, for masonry layouts. */
  lanes?: number
  /**
   * Whether to skip measuring each rendered item and use `estimateSize` as its size. Set it when every item has the
   * same size: scrolling gets cheaper.
   * @defaultValue false
   */
  skipMeasurement?: boolean
}

/** The size of the edge fade. */
export type ScrollAreaShadowOptions = {
  /**
   * The fade size in px.
   * @defaultValue 40
   */
  size?: number
}

/** Props of `ScrollArea`, a scroll container that renders a list of items, optionally virtualized. */
export type ScrollAreaProps<T = unknown> = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The scroll direction.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<ScrollArea>['orientation']
  /** The items to render, each through the default slot. Without items the default slot is the content. */
  items?: T[]
  /**
   * Whether to render only the items in view, for long lists. Pass an object to tune the virtualizer. Whether to
   * virtualize is read once, when the component mounts.
   * @defaultValue false
   */
  virtualize?: boolean | ScrollAreaVirtualizeOptions
  /**
   * Whether to fade the edges that have more content beyond them. Pass `{ size }` to set the fade size.
   * @defaultValue false
   */
  shadow?: boolean | ScrollAreaShadowOptions
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ScrollArea>
}

/** Props of the default slot. */
export type ScrollAreaSlotProps<T = unknown> = {
  /** The item to render. An empty object when there are no `items`. */
  item: T
  /** The item's index in `items`. */
  index: number
  /** The item's position and size in the virtual list, when virtualized. */
  virtualItem?: VirtualItem
}

/** Slots of `ScrollArea`. */
export type ScrollAreaSlots<T = unknown> = {
  /** One item, rendered once per item; without `items`, the whole content. */
  default?: (props: ScrollAreaSlotProps<T>) => VNode[]
}

/** Events of `ScrollArea`. */
export type ScrollAreaEmits = {
  /** Emitted when a virtualized list starts or stops scrolling. */
  scroll: [isScrolling: boolean]
}

/** Options of `scrollToIndex`. */
export type ScrollAreaScrollToIndexOptions = {
  /**
   * Where the item lands in the view. `auto` scrolls only as far as needed to show it, and not at all when it is
   * already in view.
   * @defaultValue 'auto'
   */
  align?: 'start' | 'center' | 'end' | 'auto'
  /**
   * Whether to jump or animate to the item.
   * @defaultValue 'auto'
   */
  behavior?: ScrollBehavior
}

/** What a `ScrollArea` template ref exposes. */
export type ScrollAreaExposed = {
  /** The scroll container element. */
  readonly $el: HTMLElement | undefined
  /** Scrolls the item at `index` in `items` into view. Virtualized, it also reaches items not rendered yet. */
  scrollToIndex: (index: number, options?: ScrollAreaScrollToIndexOptions) => void
  /** The TanStack virtualizer, when virtualized: `scrollToOffset`, `measure`, `getVirtualItems` and more. */
  virtualizer: Virtualizer<Element, Element> | undefined
}
