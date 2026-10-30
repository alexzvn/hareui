import type { ClassValue } from '@/utils/tv'

/** Props for `ChartTooltipIndicator`, the color marker identifying a series in a tooltip row. */
export type ChartTooltipIndicatorProps = {
  /** CSS color of the marker, e.g. `var(--chart-1)`. */
  color?: string
  /** Additional classes merged into the element. */
  class?: ClassValue
}
