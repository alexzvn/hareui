<template>
  <ChartLayer v-if="cursor" :name="cursor.kind === 'band' ? 'cursor-band' : 'cursor-line'">
    <path
      data-slot="chart-cursor"
      :data-kind="cursor.kind"
      :d="cursor.d"
      :class="chart.classes('cursor')"
    />
  </ChartLayer>
  <!-- Chart parts mount inside the <svg>: the empty foreignObject puts the teleported panel back in the HTML
    namespace (otherwise Vue creates an SVG `div` that never renders). -->
  <foreignObject v-if="chart.overlay.value" width="0" height="0">
    <Teleport :to="chart.overlay.value">
      <!-- Without a panel the same live region stays, visually hidden, so screen readers still hear the values. -->
      <div
        v-if="shown && (translate || !panel)"
        ref="panelElement"
        data-slot="chart-tooltip-wrapper"
        :data-state="isActive ? 'open' : 'closed'"
        :data-panel="panel ? undefined : 'false'"
        role="status"
        aria-live="polite"
        :class="panel ? chart.classes('tooltip') : 'sr-only'"
        :style="wrapperStyle"
      >
        <template v-if="panel || isActive">
          <slot name="content" v-bind="shown">
            <ChartTooltipContent
              :label="shown.label"
              :payload="shown.payload"
              :indicator="indicator"
              :hide-header="hideHeader"
              :label-formatter="labelFormatter"
              :value-formatter="valueFormatter"
              :class="props.class"
            >
              <template v-if="slots.footer" #footer="footer">
                <slot name="footer" v-bind="footer" />
              </template>
            </ChartTooltipContent>
          </slot>
        </template>
      </div>
    </Teleport>
  </foreignObject>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import ChartTooltipContent from '@/components/chart-tooltip/ChartTooltipContent.vue'
import { prefersReducedMotion } from '@/utils/motion'

import { cartesianContextKey } from './cartesian'
import ChartLayer from './ChartLayer.vue'
import type {
  ChartTooltipProps,
  ChartTooltipSlotProps,
  ChartTooltipSlots,
} from './ChartTooltip.types'
import { useChartContext } from './context'

const props = withDefaults(defineProps<ChartTooltipProps>(), {
  cursor: true,
  panel: true,
  indicator: 'dot',
  hideHeader: false,
  offset: 10,
  isAnimationActive: true,
  animationDuration: 400,
})

const slots = defineSlots<ChartTooltipSlots>()

const chart = useChartContext('ChartTooltip')
const cartesian = inject(cartesianContextKey, null)

onMounted(() => {
  chart.tooltipEnabled.value++
  const interaction = chart.interaction.value
  if (props.defaultIndex !== undefined && interaction)
    chart.setActive({
      index: props.defaultIndex,
      coordinate: interaction.coordinateOf(props.defaultIndex),
      source: 'pointer',
    })
})

onBeforeUnmount(() => {
  chart.tooltipEnabled.value--
  chart.setActive(null)
})

const index = computed(() => chart.active.index)
const payload = computed(() =>
  index.value === null ? [] : chart.payloadAt(index.value, chart.active.seriesId),
)

const isActive = computed(() => index.value !== null && payload.value.length > 0)

const label = computed(() =>
  index.value === null ? undefined : chart.tooltipLabel.value(index.value),
)

// Cursor (cartesian charts only). The default kind comes from the chart type (a band in bar charts).
const cursor = computed(() => {
  if (!cartesian || props.cursor === false || index.value === null || !isActive.value) return null
  const axis = cartesian.categoryAxis.value
  const kind = props.cursor === true ? chart.cursor : props.cursor
  const plot = cartesian.offset.value
  const horizontal = cartesian.horizontal.value
  if (kind === 'band') {
    // The band covers the category (one step on a point axis), inset by half a pixel on each side.
    const count = chart.data.value.length
    const extent = horizontal ? plot.width : plot.height
    const band =
      axis.bandwidth || (count > 1 ? Math.abs(axis.position(1) - axis.position(0)) : extent)

    const start =
      (axis.bandwidth ? axis.scale(index.value) : axis.position(index.value) - band / 2) + 0.5

    const size = Math.max(band - 1, 0)

    return {
      kind,
      d: horizontal
        ? `M ${start},${plot.top} h ${size} v ${plot.height} h ${-size} Z`
        : `M ${plot.left},${start} h ${plot.width} v ${size} h ${-plot.width} Z`,
    }
  }

  const position = axis.position(index.value)

  return {
    kind,
    d: horizontal
      ? `M${position},${plot.top}L${position},${plot.top + plot.height}`
      : `M${plot.left},${position}L${plot.left + plot.width},${position}`,
  }
})

// What the panel shows. Once a datum has been active the panel stays mounted: leaving the plot hides it (keeping the
// last rows), and the next hover slides it from where it was instead of mounting a new panel.
const shown = shallowRef<ChartTooltipSlotProps | null>(null)
watch(
  [isActive, label, payload, () => chart.active.coordinate],
  () => {
    if (isActive.value) {
      shown.value = {
        active: true,
        label: label.value,
        payload: payload.value,
        coordinate: chart.active.coordinate,
      }

      return
    }

    if (shown.value?.active) shown.value = { ...shown.value, active: false }
  },
  { immediate: true },
)

// Panel position: beside the anchor, flipped to stay inside the plot area.
const panelElement = useTemplateRef<HTMLElement>('panelElement')
const size = shallowRef({ width: 0, height: 0 })

// Measured only when the content can change (not on every pointer move), and assigned only when it differs so
// moving the pointer does not trigger a second render.
watch(
  [panelElement, isActive, label, payload],
  () => {
    const element = panelElement.value
    if (!element) return
    const width = element.offsetWidth
    const height = element.offsetHeight
    if (width !== size.value.width || height !== size.value.height) size.value = { width, height }
  },
  { flush: 'post' },
)

const bounds = computed(() => {
  if (cartesian) {
    const plot = cartesian.offset.value
    return { x: plot.left, y: plot.top, width: plot.width, height: plot.height }
  }

  return { x: 0, y: 0, width: chart.width.value, height: chart.height.value }
})

type PlacementSpan = {
  /** Panel size along this axis. */
  dimension: number
  /** Where the plot area starts along this axis. */
  start: number
  /** Length of the plot area along this axis. */
  extent: number
}

const place = (coordinate: number, { dimension, start, extent }: PlacementSpan) => {
  const after = coordinate + props.offset
  if (after + dimension > start + extent)
    return Math.max(coordinate - dimension - props.offset, start)

  return after
}

const translate = computed(() => {
  const point = shown.value?.coordinate
  if (!point) return null
  const box = bounds.value

  return {
    x: place(point.x, { dimension: size.value.width, start: box.x, extent: box.width }),
    y: place(point.y, { dimension: size.value.height, start: box.y, extent: box.height }),
  }
})

// The first appearance lands in place (a transition never runs on a new element); later moves slide.
const wrapperStyle = computed(() => {
  if (!props.panel) return undefined
  const position = translate.value

  return {
    transform: position ? `translate(${position.x}px, ${position.y}px)` : undefined,
    transition:
      isActive.value && props.isAnimationActive && !prefersReducedMotion()
        ? `transform ${props.animationDuration}ms ease`
        : undefined,
    visibility: isActive.value ? undefined : ('hidden' as const),
  }
})
</script>
