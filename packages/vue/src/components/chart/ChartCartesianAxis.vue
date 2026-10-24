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
import type { ResolvedAxis } from './cartesian.types'
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

type AxisOrientation = ResolvedAxis['orientation']
type AxisBox = ResolvedAxis['box']
type AxisSegment = { x1: number; y1: number; x2: number; y2: number }
type TickGeometry = { line: AxisSegment; x: number; y: number }

/** Where tick lines start (`box`), how long they are, and the label offset (`gap`). */
type TickFrame = { box: AxisBox; tickSize: number; gap: number }

// The axis line runs along the box edge facing the plot area.
const axisLines = {
  top: (box: AxisBox) => ({
    x1: box.x,
    y1: box.y + box.height,
    x2: box.x + box.width,
    y2: box.y + box.height,
  }),
  left: (box: AxisBox) => ({
    x1: box.x + box.width,
    y1: box.y,
    x2: box.x + box.width,
    y2: box.y + box.height,
  }),
  right: (box: AxisBox) => ({ x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.height }),
  bottom: (box: AxisBox) => ({ x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y }),
} as const satisfies Record<AxisOrientation, (box: AxisBox) => AxisSegment>

const tickAnchors = {
  left: { textAnchor: 'end', dy: '0.355em' },
  right: { textAnchor: 'start', dy: '0.355em' },
  top: { textAnchor: 'middle', dy: '0em' },
  bottom: { textAnchor: 'middle', dy: '0.71em' },
} as const satisfies Record<AxisOrientation, { textAnchor: string; dy: string }>

const tickGeometries = {
  top: (tick: ChartTick, { box, tickSize, gap }: TickFrame) => {
    const y = box.y + box.height

    return {
      line: { x1: tick.coordinate, y1: y, x2: tick.coordinate, y2: y - tickSize },
      x: tick.labelCoordinate,
      y: y - gap,
    }
  },
  left: (tick: ChartTick, { box, tickSize, gap }: TickFrame) => {
    const x = box.x + box.width

    return {
      line: { x1: x, y1: tick.coordinate, x2: x - tickSize, y2: tick.coordinate },
      x: x - gap,
      y: tick.labelCoordinate,
    }
  },
  right: (tick: ChartTick, { box, tickSize, gap }: TickFrame) => {
    const x = box.x

    return {
      line: { x1: x, y1: tick.coordinate, x2: x + tickSize, y2: tick.coordinate },
      x: x + gap,
      y: tick.labelCoordinate,
    }
  },
  bottom: (tick: ChartTick, { box, tickSize, gap }: TickFrame) => {
    const y = box.y

    return {
      line: { x1: tick.coordinate, y1: y, x2: tick.coordinate, y2: y + tickSize },
      x: tick.labelCoordinate,
      y: y + gap,
    }
  },
} as const satisfies Record<AxisOrientation, (tick: ChartTick, frame: TickFrame) => TickGeometry>

const chart = useChartContext('ChartXAxis')

const line = computed(() => axisLines[props.axis.orientation](props.axis.box))
const anchor = computed(() => tickAnchors[props.axis.orientation])

const ticks = computed(() => {
  const { box, orientation } = props.axis
  const geometry = tickGeometries[orientation]

  // The tick size is always reserved, even with tick lines hidden.
  const frame = { box, tickSize: props.tickSize, gap: props.tickSize + props.tickMargin }

  return props.axis.ticks.map((tick) => ({ tick, ...geometry(tick, frame) }))
})
</script>
