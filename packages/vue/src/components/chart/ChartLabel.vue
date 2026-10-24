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

<script lang="ts">
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
</script>

<script setup lang="ts">
import { computed } from 'vue'

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
        ...labelAttrs(item.viewBox, position, props.offset),
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
      ...labelAttrs(viewBox, position, props.offset),
    },
  ]
})
</script>
