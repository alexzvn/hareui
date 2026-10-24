import type { ClassValue } from '@/utils/tv'

import type { ChartLabelPosition } from './label'

/** Props of `ChartLabel`: value labels on each datum of a series, or one label inside a reference shape. */
export type ChartLabelProps = {
  /** Key of the label value in each row. Inside a series it defaults to the series values. */
  dataKey?: string
  /** Text of a single label placed directly in a chart (e.g. a total in the middle of a donut). */
  value?: number | string
  /**
   * Where the label sits relative to its shape. Defaults to `'center'` for bars, `'inside'` for pie slices,
   * `'insideStart'` for radial bars, `'top'` for area and line points, and `'outside'` for radar points
   * (past the point along its spoke, away from the center).
   */
  position?: ChartLabelPosition
  /**
   * Distance from the shape, in px.
   * @defaultValue 5
   */
  offset?: number
  /** Formats each label. */
  formatter?(value: number | string | undefined, index: number): string
  /** Text color. */
  fill?: string
  /** Additional classes merged into each `<text>`. */
  class?: ClassValue
}

/** Props of the `ChartLabel` default slot, one call per label. */
export type ChartLabelSlotProps = {
  /** Raw value. */
  value: number | string | undefined
  /** Formatted text. */
  text: string
  /** Data index (`-1` for a single label). */
  index: number
  /** Horizontal anchor point in SVG px. */
  x: number
  /** Vertical anchor point in SVG px. */
  y: number
  /** `text-anchor` that keeps the label clear of its shape at this position. */
  textAnchor: 'start' | 'middle' | 'end'
  /** `dominant-baseline` that keeps the label clear of its shape at this position. */
  dominantBaseline: 'auto' | 'central' | 'hanging'
}

/** Slots of `ChartLabel`. */
export type ChartLabelSlots = {
  /** Replaces each label. Render SVG (`<text>`, `<g>`). */
  default?: (props: ChartLabelSlotProps) => unknown
}
