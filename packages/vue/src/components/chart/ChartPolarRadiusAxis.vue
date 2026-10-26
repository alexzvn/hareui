<template>
  <ChartLayer v-if="!hide" name="axis">
    <g data-slot="chart-polar-radius-axis" :class="chart.classes('axis', props.class)">
      <line
        v-if="axisLine"
        data-slot="chart-polar-radius-axis-line"
        v-bind="line"
        :class="chart.classes('radiusAxisLine')"
      />
      <template v-if="tickOptions.label">
        <g
          v-for="item in ticks"
          :key="item.key"
          data-slot="chart-polar-radius-axis-tick"
          :transform="item.transform"
        >
          <slot
            name="tick"
            :x="item.x"
            :y="item.y"
            :value="item.value"
            :index="item.index"
            :text="item.text"
            :text-anchor="textAnchor"
          >
            <text
              :x="item.x"
              :y="item.y"
              :text-anchor="textAnchor"
              :class="chart.classes('radiusTick')"
              >{{ item.text }}</text
            >
          </slot>
        </g>
      </template>
    </g>
  </ChartLayer>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed } from 'vue'

import ChartLayer from './ChartLayer.vue'
import type {
  ChartPolarRadiusAxisProps,
  ChartPolarRadiusAxisSlots,
  ChartPolarRadiusAxisTickOptions,
} from './ChartPolarRadiusAxis.types'
import { useChartContext } from './context'
import { polarToCartesian } from './label'
import { usePolarContext } from './polar-context'

const props = withDefaults(defineProps<ChartPolarRadiusAxisProps>(), {
  angle: 0,
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  axisLine: true,
  orientation: 'right',
  hide: false,
})

defineSlots<ChartPolarRadiusAxisSlots>()

const TICK_DEFAULTS: Readonly<Required<Omit<ChartPolarRadiusAxisTickOptions, 'formatter'>>> = {
  label: true,
  count: 5,
}

const tickOptions = computed(() => defu(props.tick, TICK_DEFAULTS))

const chart = useChartContext('ChartPolarRadiusAxis')
const polar = usePolarContext('ChartPolarRadiusAxis')

polar.registerRadiusAxis(() => ({
  dataKey: props.dataKey,
  type: props.type,
  domain: props.domain,
  tickCount: tickOptions.value.count,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  ticks: props.ticks,
  reversed: props.reversed,
}))

const line = computed(() => {
  const [r0, r1] = polar.radiusAxis.value.range
  const center = { cx: polar.cx.value, cy: polar.cy.value }
  const from = polarToCartesian(center, { radius: r0, angle: props.angle })
  const to = polarToCartesian(center, { radius: r1, angle: props.angle })

  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y }
})

const tickAnchors = {
  left: 'end',
  right: 'start',
  middle: 'middle',
} as const satisfies Record<NonNullable<ChartPolarRadiusAxisProps['orientation']>, string>

const textAnchor = computed(() => tickAnchors[props.orientation])

const ticks = computed(() => {
  const { formatter } = tickOptions.value

  return polar.radiusAxis.value.ticks.map((tick) => {
    const point = polarToCartesian(
      { cx: polar.cx.value, cy: polar.cy.value },
      { radius: tick.coordinate, angle: props.angle },
    )

    return {
      key: `${tick.index}-${tick.value}`,
      index: tick.index,
      value: tick.value,
      text: formatter ? formatter(tick.value, tick.index) : String(tick.value),
      x: point.x,
      y: point.y,
      // Labels run along the axis line.
      transform: `rotate(${90 - props.angle}, ${point.x}, ${point.y})`,
    }
  })
})
</script>
