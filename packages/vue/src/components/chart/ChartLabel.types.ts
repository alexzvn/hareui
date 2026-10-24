import type { ClassValue } from '@/utils/tv'

import type { ChartLabelPosition } from './label'

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

export type ChartLabelSlotProps = {
  /** Raw value. */
  value: number | string | undefined
  /** Formatted text. */
  text: string
  /** Data index (`-1` for a single label). */
  index: number
  /** Anchor point in SVG px. */
  x: number
  y: number
  textAnchor: 'start' | 'middle' | 'end'
  dominantBaseline: 'auto' | 'central' | 'hanging'
}

export type ChartLabelSlots = {
  /** Replaces each label. Render SVG (`<text>`, `<g>`). */
  default?: (props: ChartLabelSlotProps) => unknown
}
