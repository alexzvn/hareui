<template>
  <ul
    data-slot="chart-legend"
    :data-orientation="orientation"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <li
      v-for="(item, index) in rows"
      :key="item.key"
      data-slot="chart-legend-item"
      :data-hidden="item.hidden ? 'true' : undefined"
      :class="ui.item({ class: props.ui?.item })"
    >
      <component
        :is="toggleable ? 'button' : 'span'"
        data-slot="chart-legend-trigger"
        :type="toggleable ? 'button' : undefined"
        :aria-pressed="toggleable ? String(!item.hidden) : undefined"
        :class="ui.trigger({ class: props.ui?.trigger })"
        @click="toggleable ? toggle(item.key) : undefined"
      >
        <slot
          v-if="slots.item"
          name="item"
          :item="item"
          :index="index"
          :toggle="() => toggle(item.key)"
        />
        <template v-else>
          <span
            data-slot="chart-legend-indicator"
            aria-hidden="true"
            :class="ui.indicator({ class: props.ui?.indicator })"
            :style="{ backgroundColor: item.color }"
          />
          <span data-slot="chart-legend-label" :class="ui.label({ class: props.ui?.label })">{{
            item.name
          }}</span>
          <span
            v-if="showValue && item.value !== undefined"
            data-slot="chart-legend-value"
            :class="ui.value({ class: props.ui?.value })"
            >{{ formatValue(item.value, item.key) }}</span
          >
          <span
            v-if="showPercent && item.percent !== undefined"
            data-slot="chart-legend-percent"
            :class="ui.percent({ class: props.ui?.percent })"
            >{{ formatPercent(item.percent) }}</span
          >
        </template>
      </component>
    </li>
  </ul>
</template>

<script lang="ts">
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartSeriesBase,
  ChartSeriesInput,
  ChartValueKey,
} from '@/components/chart/series-config'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type ChartLegendTheme = typeof theme

/** An explicit legend row. `hidden` falls back to the `hidden` list. */
export type ChartLegendEntry = Pick<ChartLegendItem, 'key' | 'name' | 'color'> &
  Partial<ChartLegendItem>

export interface ChartLegendProps<T extends object = Record<string, unknown>> {
  /** Explicit rows. Wins over `series` and `data`. */
  items?: ChartLegendEntry[]
  /** One row per series, named and colored like the chart that gets the same `series` and `colors`. */
  series?: ChartSeriesInput<T, ChartSeriesBase>
  /** Palette by position, or (with `data` and `index`) colors keyed by slice name. */
  colors?: string[] | Record<string, string>
  /** Pie and radial rows: with `index` (and no `series`), one row per datum with its value and share. */
  data?: T[]
  /** Slice name key of `data`. */
  index?: ChartIndexKey<T>
  /**
   * Slice value key of `data`.
   * @defaultValue the first numeric key except `index`
   */
  valueKey?: ChartValueKey<T>
  /**
   * Row direction. Vertical lists suit pie breakdowns.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ChartLegendTheme>['orientation']
  /**
   * Shape of the color marker.
   * @defaultValue 'dot'
   */
  indicator?: ComponentVariants<ChartLegendTheme>['indicator']
  /**
   * Shows each row's value (slice rows, or items with `value`).
   * @defaultValue false
   */
  showValue?: boolean
  /**
   * Shows each row's share of the visible total (slice rows, or items with `percent`).
   * @defaultValue false
   */
  showPercent?: boolean
  /** Formats values; receives the row's key. Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number, key: string) => string
  /** Formats shares (0–100). Defaults to a rounded percentage such as `42%`. */
  percentFormatter?: (percent: number) => string
  /**
   * Rows become toggle buttons that add or remove their key from `hidden`.
   * @defaultValue false
   */
  toggleable?: boolean
  /** Keys of hidden rows (`v-model:hidden`). Hidden rows are dimmed. */
  hidden?: string[]
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChartLegendTheme>
}

export interface ChartLegendItemSlotProps {
  item: ChartLegendItem
  index: number
  /** Toggles the row's key in `hidden`. */
  toggle: () => void
}

export interface ChartLegendSlots {
  /** Replaces the content of a row; the row element and its toggle button stay. */
  item?: (props: ChartLegendItemSlotProps) => any
}
</script>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'

import {
  resolveSeries,
  resolveSlices,
  seriesLegendItems,
  toggleHiddenKey,
} from '@/components/chart/series-config'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<ChartLegendProps<T>>(), {
  orientation: 'horizontal',
  indicator: 'dot',
  showValue: false,
  showPercent: false,
  toggleable: false,
})
const slots = defineSlots<ChartLegendSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const ui = useComponentUI('chartLegend', theme, () => ({
  orientation: props.orientation,
  indicator: props.indicator,
  toggleable: props.toggleable,
}))

const rows = computed<ChartLegendItem[]>(() => {
  const hiddenKeys = hidden.value
  if (props.items) {
    return props.items.map((item) => ({
      ...item,
      hidden: item.hidden ?? hiddenKeys.includes(item.key),
    }))
  }
  if (props.series) {
    return seriesLegendItems(
      resolveSeries<T>({
        data: props.data ?? [],
        index: props.index,
        series: props.series,
        colors: Array.isArray(props.colors) ? props.colors : undefined,
        hidden: hiddenKeys,
      }),
    )
  }
  if (props.data && props.index !== undefined) {
    return resolveSlices({
      data: props.data,
      index: props.index,
      valueKey: props.valueKey,
      colors: props.colors,
      hidden: hiddenKeys,
    }).map((slice) => ({
      key: slice.key,
      name: slice.name,
      color: slice.color,
      hidden: slice.hidden,
      value: slice.value,
      percent: slice.percent,
    }))
  }
  return []
})

function formatValue(value: number, key: string) {
  return props.valueFormatter ? props.valueFormatter(value, key) : value.toLocaleString()
}

function formatPercent(percent: number) {
  return props.percentFormatter ? props.percentFormatter(percent) : `${Math.round(percent)}%`
}

function toggle(key: string) {
  hidden.value = toggleHiddenKey(hidden.value, key)
}
</script>
