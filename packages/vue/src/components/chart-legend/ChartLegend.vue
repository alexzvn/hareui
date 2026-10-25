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

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'

import type { ChartLegendItem } from '@/components/chart/series-config'
import {
  resolveSeries,
  resolveSlices,
  seriesLegendItems,
  toggleHiddenKey,
} from '@/components/chart/series-config'
import { useComponentUI } from '@/composables/useComponentUI'

import type { ChartLegendProps, ChartLegendSlots } from './ChartLegend.types'
import theme from './theme'

const props = withDefaults(defineProps<ChartLegendProps<T>>(), {
  orientation: 'horizontal',
  indicator: 'dot',
  showValue: false,
  showPercent: false,
  toggleable: false,
})

const slots = defineSlots<ChartLegendSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const ui = useComponentUI('chartLegend', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    indicator: props.indicator,
    toggleable: props.toggleable,
  }),
})

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
      valueKey: props.value?.key,
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

const formatValue = (value: number, key: string) => {
  const format = props.value?.formatter

  return format ? format(value, key) : value.toLocaleString()
}

const formatPercent = (percent: number) => {
  return props.percentFormatter ? props.percentFormatter(percent) : `${Math.round(percent)}%`
}

const toggle = (key: string) => {
  hidden.value = toggleHiddenKey(hidden.value, key)
}
</script>
