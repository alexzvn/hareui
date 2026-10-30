<template>
  <div
    ref="track"
    aria-label="Amount of color in gray"
    :aria-valuemax="MAX_CHROMA"
    :aria-valuemin="0"
    :aria-valuenow="value"
    :class="cn(SLIDER_TRACK, props.class)"
    role="slider"
    tabindex="0"
    :style="{
      background: `linear-gradient(to right, oklch(0.7 0 ${hue}), oklch(0.7 ${MAX_CHROMA} ${hue}))`,
    }"
    @keydown="onKeyDown"
    @pointerdown="onPointerDown"
  >
    <div
      :class="SLIDER_THUMB"
      :style="{
        backgroundColor: currentColor,
        left: `${thumbPosition}%`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/chroma-slider.tsx`: a slider for selecting chroma/saturation.
import { computed, useTemplateRef } from 'vue'

import type { ClassValue } from './controlsCn'
import { cn } from './controlsCn'

const props = defineProps<{
  value: number
  hue: number
  class?: ClassValue
}>()

const emit = defineEmits<{ change: [value: number] }>()

// Max chroma for subtle gray tinting - 0.02 keeps colors professional without high contrast
const MAX_CHROMA = 0.02

const SLIDER_TRACK = 'relative h-8 w-full cursor-pointer touch-none rounded-full'

const SLIDER_THUMB =
  'size-4 rounded-full border-[1.5px] border-white shadow-lg absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-shadow'

const track = useTemplateRef<HTMLDivElement>('track')
let isDragging = false

const getValueFromPosition = (clientX: number) => {
  if (!track.value) return props.value
  const rect = track.value.getBoundingClientRect()
  const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))

  // Round to 4 decimal places for finer control with smaller max
  return Math.round(percentage * MAX_CHROMA * 10000) / 10000
}

const onPointerDown = (e: PointerEvent) => {
  isDragging = true

  // Capture pointer to receive events even when pointer leaves the element
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  emit('change', getValueFromPosition(e.clientX))

  const onPointerMove = (e: PointerEvent) => {
    if (isDragging) {
      emit('change', getValueFromPosition(e.clientX))
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    isDragging = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

// Next value per handled key, from the current value and step (Shift = coarse step)
const KEY_VALUES = {
  ArrowLeft: (value: number, step: number) => Math.max(0, value - step),
  ArrowDown: (value: number, step: number) => Math.max(0, value - step),
  ArrowRight: (value: number, step: number) => Math.min(MAX_CHROMA, value + step),
  ArrowUp: (value: number, step: number) => Math.min(MAX_CHROMA, value + step),
  Home: () => 0,
  End: () => MAX_CHROMA,
} as const satisfies Record<string, (value: number, step: number) => number>

const isHandledKey = (key: string): key is keyof typeof KEY_VALUES => Object.hasOwn(KEY_VALUES, key)

const onKeyDown = (e: KeyboardEvent) => {
  if (!isHandledKey(e.key)) return

  const step = e.shiftKey ? 0.002 : 0.0002
  const newValue = KEY_VALUES[e.key](props.value, step)

  e.preventDefault()
  emit('change', Math.round(newValue * 10000) / 10000)
}

// Calculate thumb position (0-100%)
const thumbPosition = computed(() => (props.value / MAX_CHROMA) * 100)

// Current color at this chroma level
const currentColor = computed(() => `oklch(0.7 ${props.value} ${props.hue})`)
</script>
