<template>
  <ChartLayer v-if="labels.length" name="label">
    <g data-slot="chart-labels">
      <template v-for="label in labels" :key="label.index">
        <slot v-bind="label">
          <text
            data-slot="chart-label"
            :x="label.x"
            :y="label.y"
            :text-anchor="label.textAnchor"
            :dominant-baseline="label.dominantBaseline"
            :style="fill ? { fill } : undefined"
            :class="chart.classes('label', props.class)"
            >{{ label.text }}</text
          >
        </slot>
      </template>
    </g>
  </ChartLayer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ChartLabelProps, ChartLabelSlotProps, ChartLabelSlots } from './ChartLabel.types'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import { labelAttrs, useChartLabelSource } from './label'

const props = withDefaults(defineProps<ChartLabelProps>(), { offset: 5 })
defineSlots<ChartLabelSlots>()

const chart = useChartContext('ChartLabel')
const source = useChartLabelSource()

const format = (value: number | string | undefined, index: number) => {
  if (props.formatter) return props.formatter(value, index)
  return value === undefined || value === null ? '' : String(value)
}

const labels = computed<ChartLabelSlotProps[]>(() => {
  if (!source) return []
  const position = props.position ?? source.position ?? 'center'
  if (source.items) {
    return source.items().map((item) => {
      const value = props.dataKey
        ? (item.datum[props.dataKey] as number | string | undefined)
        : item.value

      return {
        value,
        text: format(value, item.index),
        index: item.index,
        ...labelAttrs(item.viewBox, { position, offset: props.offset }),
      }
    })
  }

  const viewBox = source.viewBox?.()
  if (!viewBox) return []

  return [
    {
      value: props.value,
      text: format(props.value, -1),
      index: -1,
      ...labelAttrs(viewBox, { position, offset: props.offset }),
    },
  ]
})
</script>
