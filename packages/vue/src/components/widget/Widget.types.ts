import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Widget = typeof theme

/** One entry of the `Widget` legend. */
export type WidgetLegendItem = {
  /** The text shown next to the dot. */
  label: string
  /** The dot colour: any CSS colour, such as `var(--chart-3)`. */
  color: string
}

/** Props of `Widget`, a dashboard panel: a header with a title, a description and a legend above an elevated content area. */
export type WidgetProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The heading shown at the start of the header. */
  title?: string
  /** Secondary text shown in the header. */
  description?: string
  /** Legend entries shown at the end of the header, one coloured dot and label each. */
  legend?: WidgetLegendItem[]
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `{ content: 'p-0' }` makes the content edge to edge. */
  ui?: ComponentSlots<Widget>
}

/** Slots of `Widget`. */
export type WidgetSlots = {
  /** Replaces the whole header. */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Replaces the legend list. */
  legend?: (props: { items: WidgetLegendItem[] }) => VNode[]
  /** The content area. */
  default?: () => VNode[]
  /** Content below the content area. The footer renders only when this slot is given. */
  footer?: () => VNode[]
}
