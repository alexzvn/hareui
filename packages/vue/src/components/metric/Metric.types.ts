import type { VNode } from 'vue'

import type { CardProps } from '@/components/card/Card.types'
import type { DropdownEntry, DropdownValue } from '@/components/dropdown/Dropdown.types'
import type {
  NumberValueProps,
  NumberValueSlotProps,
} from '@/components/number-value/NumberValue.types'
import type { TrendChipProps } from '@/components/trend-chip/TrendChip.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Metric = typeof theme

/** A status colour of a `Metric` icon or progress bar. */
export type MetricStatus = 'success' | 'warning' | 'danger'

/** Formatting of the `Metric` value: every `NumberValue` prop except `value`. */
export type MetricFormat = Omit<NumberValueProps, 'value' | 'class' | 'ui'>

/** The `Metric` trend chip: `TrendChip` props, with the chip text in `label`. */
export type MetricTrend = Omit<TrendChipProps, 'label'> & {
  /** The chip text, e.g. `+3.2%`. */
  label: string | number
}

/** The `Metric` progress bar. */
export type MetricProgress = {
  /** Progress from 0 to 100. */
  value: number
  /**
   * Colour of the fill.
   * @defaultValue 'success'
   */
  status?: MetricStatus
}

/** Props of `Metric`, a card showing one key figure with its trend, progress or sparkline. */
export type MetricProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: CardProps['as']
  /**
   * Visual style of the card surface.
   * @defaultValue 'default'
   */
  variant?: CardProps['variant']
  /** The metric label, rendered as a `dt`. */
  title?: string
  /** Icon shown before the title in a 32 px tinted box. */
  icon?: IconValue
  /** Tints the icon box. Exposed as `data-status` on the icon box. */
  status?: MetricStatus
  /** The number, formatted with `format` and rendered as a `dd`. */
  value?: number
  /** `NumberValue` options for the value, e.g. `{ format: 'currency', currency: 'USD' }`. */
  format?: MetricFormat
  /** Trend chip shown next to the value. */
  trend?: MetricTrend
  /** Progress bar shown under the value. */
  progress?: MetricProgress
  /**
   * Where the `chart` slot goes: `bottom` runs it edge to edge under the value, `inline` puts it in a column beside
   * the value and the trend. Exposed as `data-chart-placement`.
   * @defaultValue 'bottom'
   */
  chartPlacement?: ComponentVariants<Metric>['chartPlacement']
  /** Menu entries of the three-dot actions button in the top-right corner. The button renders only when set. */
  actions?: DropdownEntry[]
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Metric>
}

/** Emits of `Metric`. */
export type MetricEmits = {
  /** An `actions` menu item was chosen. */
  action: [value: DropdownValue]
}

/** Slots of `Metric`. */
export type MetricSlots = {
  /** Replaces the icon inside the tinted icon box. */
  icon?: () => VNode[]
  /** Replaces the title text inside the `dt`. */
  title?: () => VNode[]
  /** Replaces the actions menu in the top-right corner. */
  actions?: () => VNode[]
  /** Replaces the formatted number inside the `dd`. */
  value?: (props: NumberValueSlotProps) => VNode[]
  /** Replaces the trend chip. */
  trend?: () => VNode[]
  /** Content under the value: other figures, a legend, … */
  default?: () => VNode[]
  /**
   * A sparkline whose left and right edges fade out: full-bleed at the bottom in an 80 px area, or beside the value in
   * a 70 px area with `chartPlacement: 'inline'`.
   */
  chart?: () => VNode[]
  /** Content under a full-width separator at the bottom. */
  footer?: () => VNode[]
}
