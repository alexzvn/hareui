<template>
  <div v-if="dragging" aria-hidden="true" class="absolute inset-0 z-2 cursor-ew-resize" />
  <div
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize preview"
    :aria-valuenow="width"
    :aria-valuemin="min"
    :aria-valuemax="max"
    tabindex="0"
    class="group/handle absolute inset-y-0 z-3 hidden w-6 cursor-ew-resize touch-none items-center justify-center outline-none select-none md:flex"
    :style="edge === undefined ? { right: '0px' } : { left: `${edge - 24}px` }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @lostpointercapture="onPointerEnd"
    @pointerenter="emit('preload')"
    @focus="emit('preload')"
    @keydown="onKeydown"
  >
    <span
      aria-hidden="true"
      :class="[
        'h-10 w-1.5 rounded-full transition-colors group-focus-visible/handle:status-focused motion-reduce:transition-none',
        dragging ? 'bg-muted/30' : 'bg-muted/20 hover:bg-muted/30',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * heroui.pro's preview resize handle: a 24px-wide strip just inside the frame's right edge with a 6×40 grey pill.
 * Dragging resizes 1:1 with the pointer (pointer capture; an overlay keeps the iframe from swallowing the moves).
 * Arrow keys step 10px (Shift: 50px), Home/End jump to the minimum/maximum width.
 */
const props = defineProps<{
  /** Current viewport width of the frame (px). */
  width: number
  min: number
  max: number
  /** Distance of the frame's right edge from the stage's left edge (px); `undefined` pins the handle to the right. */
  edge?: number
}>()
const emit = defineEmits<{ resize: [width: number]; preload: [] }>()
/** True while the pointer drags the handle. */
const dragging = defineModel<boolean>('dragging', { default: false })

const clamp = (value: number) => Math.round(Math.min(props.max, Math.max(props.min, value)))

let start: { x: number; width: number } | undefined
function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  // No text selection or focus change: the drag owns the pointer.
  event.preventDefault()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  start = { x: event.clientX, width: props.width }
  dragging.value = true
}
function onPointerMove(event: PointerEvent) {
  if (start) emit('resize', clamp(start.width + event.clientX - start.x))
}
function onPointerEnd() {
  start = undefined
  dragging.value = false
}

const STEPS: Record<string, number> = { ArrowLeft: -10, ArrowRight: 10 }
function onKeydown(event: KeyboardEvent) {
  let next: number | undefined
  if (event.key in STEPS) next = props.width + STEPS[event.key] * (event.shiftKey ? 5 : 1)
  else if (event.key === 'Home') next = props.min
  else if (event.key === 'End') next = props.max
  if (next === undefined) return
  event.preventDefault()
  emit('resize', clamp(next))
}
</script>
