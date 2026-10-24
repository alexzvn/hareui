<template>
  <div
    v-if="active"
    data-slot="chart-tooltip"
    :data-indicator="indicator"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot v-if="slots.default" />
    <template v-else>
      <ChartTooltipHeader v-if="!hideHeader && headerText !== undefined">
        {{ headerText }}
      </ChartTooltipHeader>
      <ChartTooltipItem v-for="row in rows" :key="row.key">
        <ChartTooltipIndicator :color="row.color" />
        <ChartTooltipLabel>{{ row.name }}</ChartTooltipLabel>
        <ChartTooltipValue>{{ row.value }}</ChartTooltipValue>
      </ChartTooltipItem>
      <slot name="footer" :label="label" :payload="payload ?? []" />
    </template>
  </div>
</template>

<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ChartTooltipPayloadEntry } from '../chart/types'
import theme from './theme'

type ChartTooltip = typeof theme

/** A payload row. Charts pass full entries; hand-written payloads may set only `name`, `value` and a color. */
export type ChartTooltipContentEntry = Partial<ChartTooltipPayloadEntry> & {
  /** Used as the indicator color when `color` is missing. */
  stroke?: string
  /** Used as the indicator color when `color` and `stroke` are missing. */
  fill?: string
}

export interface ChartTooltipContentProps {
  /**
   * Renders the panel. Nothing is rendered when `false`.
   * @defaultValue true
   */
  active?: boolean
  /**
   * Shape of the color marker next to each series name.
   * @defaultValue 'dot'
   */
  indicator?: ComponentVariants<ChartTooltip>['indicator']
  /** Header text, usually the x-axis value of the hovered point. */
  label?: number | string
  /** Series rows to render when the default slot is empty. */
  payload?: ChartTooltipContentEntry[]
  /**
   * Hides the header row.
   * @defaultValue false
   */
  hideHeader?: boolean
  /** Formats the header label. */
  labelFormatter?: (label: number | string) => string
  /** Formats each series value. Also receives the row's entry, so the format can depend on its `dataKey`. Values print as given by default. */
  valueFormatter?: (value: number | string, entry: ChartTooltipContentEntry) => string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-part class overrides, also applied to composed parts. */
  ui?: ComponentSlots<ChartTooltip>
}

export interface ChartTooltipContentSlots {
  /** Manual composition with `ChartTooltipHeader` and `ChartTooltipItem`. Replaces the rows built from `payload`. */
  default?: () => any
  /** Content under the rows built from `payload`, e.g. a total. Not rendered when the default slot is used. */
  footer?: (props: { label?: number | string; payload: ChartTooltipContentEntry[] }) => any
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import ChartTooltipHeader from './ChartTooltipHeader.vue'
import ChartTooltipIndicator from './ChartTooltipIndicator.vue'
import ChartTooltipItem from './ChartTooltipItem.vue'
import ChartTooltipLabel from './ChartTooltipLabel.vue'
import ChartTooltipValue from './ChartTooltipValue.vue'
import { chartTooltipContextKey } from './context'

const props = withDefaults(defineProps<ChartTooltipContentProps>(), {
  active: true,
  indicator: 'dot',
  hideHeader: false,
})
const slots = defineSlots<ChartTooltipContentSlots>()

const ui = useComponentUI('chartTooltip', theme, () => ({ indicator: props.indicator }))
provide(chartTooltipContextKey, { classes: ui, ui: () => props.ui })

const headerText = computed(() => {
  if (props.label === undefined || props.label === '') return undefined
  return props.labelFormatter ? props.labelFormatter(props.label) : String(props.label)
})

function formatValue(entry: ChartTooltipContentEntry) {
  const value = entry.value
  if (value === undefined || value === null) return ''
  if (props.valueFormatter) return props.valueFormatter(value, entry)
  return String(value)
}

// The index keeps keys unique when two rows share a dataKey (a bar and a line on the same field).
const rows = computed(() =>
  (props.payload ?? []).map((entry, index) => ({
    key: `${entry.dataKey ?? entry.name ?? ''}-${index}`,
    color: entry.color ?? entry.stroke ?? entry.fill,
    name: entry.name ?? entry.dataKey ?? '',
    value: formatValue(entry),
  })),
)
</script>
