<template>
  <div v-bind="rootAttrs" :data-legend="legend ?? undefined" :class="frameClass" :style="rootStyle">
    <slot v-if="legend && legendFirst" name="legend" />
    <div ref="root" data-slot="chart-plot" :class="plotClass" :style="plotStyle">
      <svg
        v-if="chart.width.value > 0"
        ref="svg"
        data-slot="chart-surface"
        :width="chart.width.value"
        :height="chart.height.value"
        :viewBox="`0 0 ${chart.width.value} ${chart.height.value}`"
        :tabindex="tracking ? 0 : undefined"
        :role="tracking ? 'application' : undefined"
        v-bind="svgAttrs"
        :class="chart.classes('surface')"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
        @pointerleave="onPointerLeave"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      >
        <slot />
        <g
          v-for="name in chartLayerNames"
          :key="name"
          :ref="(element) => setLayer(name, element)"
          :data-layer="name"
          aria-hidden="true"
        />
      </svg>
      <div :ref="setOverlay" data-slot="chart-overlay" :class="chart.classes('overlay')" />
    </div>
    <slot v-if="legend && !legendFirst" name="legend" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useAttrs, watch, watchEffect } from 'vue'

import { useChartContext } from './context'
import type { ChartLegendPosition } from './series-config'
import type { ChartLayerName } from './types'
import { chartLayerNames } from './types'

// Internal: the responsive container every chart root renders. Measures its width, draws the `<svg>` with one
// `<g>` per z-layer (parts teleport into them through `ChartLayer`), an HTML overlay for the tooltip, and turns
// pointer and keyboard input into the chart's active datum. `role` and `aria-*` attributes set on the chart root
// land on the `<svg>` (e.g. `aria-label`); every other attribute stays on the container. With `legend`, the
// container becomes a flex frame holding the `#legend` slot and the plot box (`height` then sizes the plot box).

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** Width in px, or a percentage of the parent. */
  width: number | `${number}%`
  /** Height in px. */
  height: number
  /** Side of the plot the `#legend` slot sits on; nothing renders without it. */
  legend?: ChartLegendPosition | null
}>()

defineSlots<{
  default?: () => any
  legend?: () => any
}>()

const chart = useChartContext('ChartSurface')
const root = shallowRef<HTMLElement | null>(null)
const svg = shallowRef<SVGSVGElement | null>(null)

const attrs = useAttrs()
const isSvgAttr = (name: string) => name === 'role' || name.startsWith('aria-')
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !isSvgAttr(name))),
)
const svgAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => isSvgAttr(name))),
)

const stacked = computed(() => props.legend === 'top' || props.legend === 'bottom')
const legendFirst = computed(() => props.legend === 'top' || props.legend === 'left')
// A legend beside the plot takes part of a fixed width, so the plot box is measured then too.
const fixedWidth = computed(() =>
  typeof props.width === 'number' && (!props.legend || stacked.value) ? props.width : null,
)

watchEffect(() => {
  chart.height.value = props.height
  if (fixedWidth.value !== null) chart.width.value = fixedWidth.value
})

let observer: ResizeObserver | undefined
function measure() {
  if (fixedWidth.value !== null || !root.value) return
  chart.width.value = Math.floor(root.value.getBoundingClientRect().width)
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(measure)
    observer.observe(root.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
// Switching between a fixed and a measured width.
watch(fixedWidth, () => measure(), { flush: 'post' })

const rootStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: props.legend ? undefined : `${props.height}px`,
}))
const plotStyle = computed(() => (props.legend ? { height: `${props.height}px` } : undefined))
const frameClass = computed(() =>
  props.legend ? ['flex gap-3', stacked.value ? 'flex-col' : 'items-center'] : undefined,
)
const plotClass = computed(() => [
  'relative',
  !props.legend ? 'h-full' : stacked.value ? 'w-full' : 'min-w-0 flex-1',
])

const tracking = computed(() => chart.tooltipEnabled.value > 0)

function setLayer(name: ChartLayerName, element: unknown) {
  chart.layers[name] = element instanceof Element ? element : null
}

function setOverlay(element: unknown) {
  chart.overlay.value = element instanceof HTMLElement ? element : null
}

function localPoint(event: PointerEvent) {
  const rect = svg.value!.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function onPointerMove(event: PointerEvent) {
  const interaction = chart.interaction.value
  if (!tracking.value || !interaction?.hitTest) return
  const { x, y } = localPoint(event)
  const hit = interaction.hitTest(x, y)
  chart.setActive(
    hit
      ? {
          index: hit.index,
          seriesId: hit.seriesId ?? null,
          coordinate: hit.coordinate,
          source: 'pointer',
        }
      : null,
  )
}

function onPointerLeave() {
  if (chart.active.source === 'pointer') chart.setActive(null)
}

// Position after a navigation key in a list of `count` items, `undefined` for other keys.
function nextPosition(key: string, current: number | null, count: number) {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return current === null ? 0 : Math.min(current + 1, count - 1)
    case 'ArrowLeft':
    case 'ArrowUp':
      return current === null ? count - 1 : Math.max(current - 1, 0)
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return undefined
  }
}

function onKeydown(event: KeyboardEvent) {
  const interaction = chart.interaction.value
  if (!tracking.value || !interaction) return
  if (event.key === 'Escape') {
    chart.setActive(null)
    return
  }
  // Item-triggered charts with several series (nested pies) walk every item, series by series.
  if (interaction.items) {
    const items = interaction.items()
    const current = items.findIndex(
      (item) => item.seriesId === chart.active.seriesId && item.index === chart.active.index,
    )
    const position = nextPosition(event.key, current < 0 ? null : current, items.length)
    const item = position === undefined ? undefined : items[position]
    if (!item) return
    event.preventDefault()
    chart.setActive({
      index: item.index,
      seriesId: item.seriesId,
      coordinate: item.coordinate,
      source: 'keyboard',
    })
    return
  }
  const count = interaction.count()
  const index = count ? nextPosition(event.key, chart.active.index, count) : undefined
  if (index === undefined) return
  event.preventDefault()
  chart.setActive({ index, coordinate: interaction.coordinateOf(index), source: 'keyboard' })
}

// Pressing the pointer focuses the chart too; only keyboard focus picks a datum.
let pointerFocus = false

function onPointerDown(event: PointerEvent) {
  pointerFocus = true
  onPointerMove(event)
}

function onFocus() {
  const interaction = chart.interaction.value
  const fromPointer = pointerFocus
  pointerFocus = false
  if (fromPointer || !tracking.value || !interaction || chart.active.index !== null) return
  const item = interaction.items?.()[0]
  if (item)
    chart.setActive({
      index: item.index,
      seriesId: item.seriesId,
      coordinate: item.coordinate,
      source: 'keyboard',
    })
  else if (!interaction.items && interaction.count() > 0)
    chart.setActive({ index: 0, coordinate: interaction.coordinateOf(0), source: 'keyboard' })
}

function onBlur() {
  pointerFocus = false
  if (chart.active.source === 'keyboard') chart.setActive(null)
}
</script>
