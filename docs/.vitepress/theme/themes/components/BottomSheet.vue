<script setup lang="ts">
// Port of HeroUI docs `themes/components/bottom-sheet.tsx` (react-aria Modal + framer-motion drag).
// react-aria `ModalOverlay`/`Modal`/`Dialog` -> Reka dialog primitives (the same ones HareUI's Modal is built on);
// framer-motion:
//   enter/exit `duration: 0.5, ease: cubicBezier(0.32, 0.72, 0, 1)` -> CSS keyframe animations (Reka's Presence waits on animations),
//   `y -> backdrop rgba(0,0,0, 0.4 -> 0)` over [0, 600]               -> `--bottom-sheet-y` drives both the sheet and the backdrop alpha,
//   `drag="y"`, `dragConstraints.top`, default elastic 0.5, dismissal `offset > 160 || velocity > 10` -> pointer events below,
//   snap-back inertia (bounce)                                         -> a 0.4s CSS transition with the same easing.
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { ref, watch } from 'vue'

const SHEET_HEIGHT = 600 // Total height of the sheet
const SNAP_HEIGHT = 320 // Height visible at snap position
const SNAP_OFFSET = SHEET_HEIGHT - SNAP_HEIGHT // Offset to show snap height
const DRAG_THRESHOLD = 3 // framer-motion starts a drag after 3px
const ELASTIC = 0.5 // framer-motion's default `dragElastic`

const props = defineProps<{
  id?: string
  isOpen: boolean
}>()
const emit = defineEmits<{ 'update:isOpen': [isOpen: boolean] }>()
defineSlots<{ default?: () => any }>()

const y = ref(SNAP_OFFSET)
const isDragging = ref(false)

// A fresh open always starts at the snap position.
watch(
  () => props.isOpen,
  (open) => {
    if (open) y.value = SNAP_OFFSET
  },
)

// Inputs that handle their own pointer gestures must not start a sheet drag.
const OWN_GESTURES = 'input, textarea, select, [role="slider"], [data-slot*="slider"]'

interface Session {
  startY: number
  pointerId: number
  active: boolean
  samples: { t: number; y: number }[]
}
let session: Session | null = null

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || (event.target as HTMLElement).closest(OWN_GESTURES)) return
  session = { startY: event.clientY, pointerId: event.pointerId, active: false, samples: [] }
}

function onPointerMove(event: PointerEvent) {
  if (!session || event.pointerId !== session.pointerId) return
  const offset = event.clientY - session.startY
  if (!session.active) {
    if (Math.abs(offset) <= DRAG_THRESHOLD) return
    session.active = true
    isDragging.value = true
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }
  // `dragConstraints.top`: dragging above the snap position is elastic.
  y.value = SNAP_OFFSET + (offset < 0 ? offset * ELASTIC : offset)
  const now = performance.now()
  session.samples.push({ t: now, y: event.clientY })
  session.samples = session.samples.filter((sample) => now - sample.t <= 100)
}

function onPointerEnd(event: PointerEvent) {
  if (!session || event.pointerId !== session.pointerId) return
  const { active, samples, startY } = session
  session = null
  if (!active) return

  const offset = event.clientY - startY
  const first = samples[0]
  const last = samples[samples.length - 1]
  const velocity =
    first && last && last.t > first.t ? ((last.y - first.y) / (last.t - first.t)) * 1000 : 0

  isDragging.value = false
  if (event.type !== 'pointercancel' && (offset > SNAP_HEIGHT * 0.5 || velocity > 10))
    emit('update:isOpen', false)
  else y.value = SNAP_OFFSET
}

// React Aria focuses the dialog itself on open (see HareUI's Modal).
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  ;(event.target as HTMLElement | null)?.focus({ preventScroll: true })
}
</script>

<template>
  <DialogRoot :open="isOpen" modal @update:open="emit('update:isOpen', $event)">
    <DialogPortal>
      <DialogOverlay
        class="bottom-sheet-overlay fixed inset-0 z-100"
        :class="{ 'is-dragging': isDragging }"
        :style="{ '--bottom-sheet-y': y }"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="bottom-sheet absolute bottom-0 w-full rounded-t-3xl bg-background shadow-lg outline-hidden will-change-transform"
          :class="{ 'is-dragging': isDragging }"
          :style="{ height: `${SHEET_HEIGHT}px` }"
          @open-auto-focus="onOpenAutoFocus"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerEnd"
          @pointercancel="onPointerEnd"
        >
          <VisuallyHidden as-child>
            <DialogTitle>Theme settings</DialogTitle>
          </VisuallyHidden>
          <!-- Drag affordance -->
          <div class="bg-default-400 mx-auto mt-2 h-1.5 w-12 rounded-full" />
          <div :id="id" class="pb-5 outline-hidden">
            <slot />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.bottom-sheet-overlay {
  background-color: rgb(0 0 0 / calc(0.4 * (1 - var(--bottom-sheet-y) / 600)));
  transition: background-color 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.bottom-sheet {
  transform: translateY(calc(var(--bottom-sheet-y) * 1px));
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  touch-action: pan-x;
}
.bottom-sheet-overlay.is-dragging,
.bottom-sheet.is-dragging {
  transition: none;
}

.bottom-sheet-overlay[data-state='open'] {
  animation: bottom-sheet-overlay-in 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
.bottom-sheet-overlay[data-state='closed'] {
  animation: bottom-sheet-overlay-out 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
.bottom-sheet[data-state='open'] {
  animation: bottom-sheet-in 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
.bottom-sheet[data-state='closed'] {
  animation: bottom-sheet-out 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

@keyframes bottom-sheet-overlay-in {
  from {
    background-color: rgb(0 0 0 / 0);
  }
}
@keyframes bottom-sheet-overlay-out {
  to {
    background-color: rgb(0 0 0 / 0);
  }
}
@keyframes bottom-sheet-in {
  from {
    transform: translateY(600px);
  }
}
@keyframes bottom-sheet-out {
  to {
    transform: translateY(600px);
  }
}
</style>
