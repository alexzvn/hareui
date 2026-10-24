import type { ClassValue } from '@/utils/tv'

/** Props of `ChartCell`: style overrides for one bar, slice or ring of the parent series, in data order. */
export type ChartCellProps = {
  /** Fill of this row's shape. */
  fill?: string
  /** Opacity of the fill. */
  fillOpacity?: number
  /** Outline color. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /** Additional classes merged into the shape. */
  class?: ClassValue
}
