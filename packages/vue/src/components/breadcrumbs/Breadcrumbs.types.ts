import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Breadcrumbs = typeof theme

export type BreadcrumbsItem = {
  /** The item text, shown unless `#item` is used. */
  label?: string
  /** The URL to link to. The last item is always the current page and renders without a link. */
  href?: string
  /** Additional classes merged into this item's `<li>` (HeroUI's `Breadcrumbs.Item` `className`). */
  class?: ClassValue
  /** Extra fields are passed through to the slots as `item`. */
  [key: string]: unknown
}

export type BreadcrumbsProps<T extends BreadcrumbsItem = BreadcrumbsItem> = {
  /**
   * The element or component to render the list as.
   * @defaultValue 'ol'
   */
  as?: PrimitiveProps['as']
  /** The breadcrumb items, from the root to the current page. */
  items: T[]
  /**
   * Whether all breadcrumb links are disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Breadcrumbs>
}

/** What the `#item` and `#separator` slots receive for each item. */
export type ItemSlotProps<T extends BreadcrumbsItem = BreadcrumbsItem> = {
  item: T
  index: number
  current: boolean
}

export type BreadcrumbsSlots<T extends BreadcrumbsItem = BreadcrumbsItem> = {
  /** Replaces an item's label. */
  item?: (props: ItemSlotProps<T>) => VNode[]
  /**
   * Custom separator between items (HeroUI's `separator` prop). A single root element receives
   * the themed separator classes and `data-slot="breadcrumbs-separator"`.
   */
  separator?: (props: ItemSlotProps<T>) => VNode[]
}
