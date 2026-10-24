import type { VNode } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip'

import type { ChartTooltipProps, ChartTooltipSlotProps } from './ChartTooltip.vue'
import type { ChartLegendItem, ChartLegendPosition } from './series-config'
import { resolveChartLegend } from './series-config'

// What every chart root (cartesian and polar) draws around its parts: the in-chart legend, which hides and shows
// series, and the tooltip drawn from props. Rendered by `ChartFrame`.

export type ChartFrameLegend = {
  position: ChartLegendPosition
  /** `ChartLegend` props: the root's defaults under the `legend` prop's own. */
  props: Partial<ChartLegendProps<object>>
}

export type ChartFrameConfig = {
  /** `null`: no legend. */
  legend: ChartFrameLegend | null
  legendItems: ChartLegendItem[]
  /** `ChartTooltip` props, or `null` when the root draws no tooltip (e.g. composition mode, a child places its own). */
  tooltip: Partial<ChartTooltipProps> | null
}

/** Root slots the frame places: legend, legend rows and tooltip. */
export type ChartFrameSlots = {
  /** Replaces the legend. `toggle(key)` hides or shows a series. */
  legend?: (props: { items: ChartLegendItem[]; toggle: (key: string) => void }) => VNode[]
  /** Replaces each legend item. */
  'legend-item'?: (props: { item: ChartLegendItem; index: number; toggle: () => void }) => VNode[]
  /** Replaces the tooltip panel of a chart drawn from props. */
  tooltip?: (props: ChartTooltipSlotProps) => VNode[]
  /** Content under the tooltip rows, e.g. a total. */
  'tooltip-footer'?: (props: {
    label?: number | string
    payload: ChartTooltipContentEntry[]
  }) => VNode[]
}

const FRAME_SLOTS = [
  'legend',
  'legend-item',
  'tooltip',
  'tooltip-footer',
] as const satisfies ReadonlyArray<keyof ChartFrameSlots>

/** The frame slots a root was given, for forwarding them to `ChartFrame` with `v-for` + `#[name]`. */
export const frameSlotNames = (
  slots: Partial<Record<keyof ChartFrameSlots, unknown>>,
): Array<keyof ChartFrameSlots> => {
  return FRAME_SLOTS.filter((name) => slots[name] !== undefined)
}

/**
 * A root's legend: its `legend` prop, else the bottom when only a `legend` slot is given (the slot is the opt-in).
 * `defaults` go under the `legend` prop's own `ChartLegend` props.
 */
export const resolveFrameLegend = (
  value:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<object>> & { position?: ChartLegendPosition })
    | undefined,
  hasLegendSlot: boolean,
  defaults: Partial<ChartLegendProps<object>> = {},
): ChartFrameLegend | null => {
  const legend = resolveChartLegend<Partial<ChartLegendProps<object>>>(value)
  if (legend) return { position: legend.position, props: { ...defaults, ...legend.props } }
  return hasLegendSlot ? { position: 'bottom', props: { ...defaults } } : null
}
