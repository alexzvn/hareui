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

<script setup lang="ts">
import { computed, provide } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  ChartTooltipContentEntry,
  ChartTooltipContentProps,
  ChartTooltipContentSlots,
} from './ChartTooltipContent.types'
import ChartTooltipHeader from './ChartTooltipHeader.vue'
import ChartTooltipIndicator from './ChartTooltipIndicator.vue'
import ChartTooltipItem from './ChartTooltipItem.vue'
import ChartTooltipLabel from './ChartTooltipLabel.vue'
import ChartTooltipValue from './ChartTooltipValue.vue'
import { chartTooltipContextKey } from './context'
import theme from './theme'

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

const formatValue = (entry: ChartTooltipContentEntry) => {
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
