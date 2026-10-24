<template>
  <ChartLayer v-if="!axis.hide" name="axis">
    <g
      :data-slot="axis.axis === 'x' ? 'chart-x-axis' : 'chart-y-axis'"
      :data-orientation="axis.orientation"
      :class="chart.classes('axis', props.class)"
    >
      <line
        v-if="axisLine"
        data-slot="chart-axis-line"
        v-bind="line"
        fill="none"
        :class="chart.classes('axisLine')"
      />
      <template v-if="tickLine">
        <line
          v-for="entry in ticks"
          :key="`line-${entry.tick.index}`"
          data-slot="chart-tick-line"
          v-bind="entry.line"
          fill="none"
          :class="chart.classes('tickLine')"
        />
      </template>
      <template v-if="tick">
        <template v-for="entry in ticks" :key="`tick-${entry.tick.index}`">
          <slot
            name="tick"
            v-bind="{
              x: entry.x,
              y: entry.y,
              value: entry.tick.value,
              index: entry.tick.index,
              text: entry.tick.text,
              textAnchor: anchor.textAnchor,
            }"
          >
            <text
              data-slot="chart-tick"
              :x="entry.x"
              :y="entry.y"
              :dy="anchor.dy"
              :text-anchor="anchor.textAnchor"
              :class="chart.classes('tick')"
              >{{ entry.tick.text }}</text
            >
          </slot>
        </template>
      </template>
    </g>
  </ChartLayer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAxisTickSlotProps } from './axis'
import type { ResolvedAxis } from './cartesian'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import type { ChartTick } from './scale'

// Internal: draws one cartesian axis (line, tick lines, tick labels).

const props = defineProps<{
  axis: ResolvedAxis
  tickSize: number
  tickMargin: number
  tick: boolean
  tickLine: boolean
  axisLine: boolean
  class?: ClassValue
}>()

defineSlots<{ tick?: (props: ChartAxisTickSlotProps) => unknown }>()

const chart = useChartContext('ChartXAxis')

const line = computed(() => {
  const { box, orientation } = props.axis
  switch (orientation) {
    case 'top':
      return { x1: box.x, y1: box.y + box.height, x2: box.x + box.width, y2: box.y + box.height }
    case 'left':
      return { x1: box.x + box.width, y1: box.y, x2: box.x + box.width, y2: box.y + box.height }
    case 'right':
      return { x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.height }
    default:
      return { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y }
  }
})

const anchor = computed(() => {
  switch (props.axis.orientation) {
    case 'left':
      return { textAnchor: 'end', dy: '0.355em' } as const
    case 'right':
      return { textAnchor: 'start', dy: '0.355em' } as const
    case 'top':
      return { textAnchor: 'middle', dy: '0em' } as const
    default:
      return { textAnchor: 'middle', dy: '0.71em' } as const
  }
})

const tickGeometry = (tick: ChartTick) => {
  const { box, orientation } = props.axis

  // The tick size is always reserved, even with tick lines hidden.
  const gap = props.tickSize + props.tickMargin
  switch (orientation) {
    case 'top': {
      const y = box.y + box.height
      return {
        line: { x1: tick.coordinate, y1: y, x2: tick.coordinate, y2: y - props.tickSize },
        x: tick.labelCoordinate,
        y: y - gap,
      }
    }
    case 'left': {
      const x = box.x + box.width
      return {
        line: { x1: x, y1: tick.coordinate, x2: x - props.tickSize, y2: tick.coordinate },
        x: x - gap,
        y: tick.labelCoordinate,
      }
    }
    case 'right': {
      const x = box.x
      return {
        line: { x1: x, y1: tick.coordinate, x2: x + props.tickSize, y2: tick.coordinate },
        x: x + gap,
        y: tick.labelCoordinate,
      }
    }
    default: {
      const y = box.y
      return {
        line: { x1: tick.coordinate, y1: y, x2: tick.coordinate, y2: y + props.tickSize },
        x: tick.labelCoordinate,
        y: y + gap,
      }
    }
  }
}

const ticks = computed(() => props.axis.ticks.map((tick) => ({ tick, ...tickGeometry(tick) })))
</script>
