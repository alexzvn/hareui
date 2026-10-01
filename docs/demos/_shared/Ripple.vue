<script setup lang="ts">
/**
 * Vue port of `m3-ripple@1.1.3` (MIT, © 2025 saltyAom), the Material Design 3 ripple
 * used by heroui.com's "Adding Ripple Effect" Button demo. Place it as the first child of
 * a positioned element; it listens to pointer events on its parent.
 */
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

const props = withDefaults(defineProps<{
  hoverOpacity?: number
  pressedOpacity?: number
  disabled?: boolean
  easing?: string
  duration?: number
  minimumPressDuration?: number
  touchDelay?: number
}>(), { disabled: false, duration: 150, minimumPressDuration: 225, touchDelay: 150 })

const INITIAL_ORIGIN_SCALE = 0.2
const PADDING = 12
const SOFT_EDGE_MINIMUM_SIZE = 75
const SOFT_EDGE_CONTAINER_RATIO = 0.35

const enum State { Inactive, TouchDelay, Holding, WaitingForClick }

const hovered = ref(false)
const pressed = ref(false)
const root = ref<HTMLDivElement>()
const surface = ref<HTMLDivElement>()

let rippleSize = ''
let rippleScale = ''
let initialSize = 0
let growAnimation: Animation | undefined
let state = State.Inactive
let rippleStartEvent: PointerEvent | undefined
let checkBoundsAfterContextMenu = false

watchEffect(() => {
  const style = surface.value?.style
  if (!style) return
  if (props.hoverOpacity !== undefined) style.setProperty('--ripple-hover-opacity', `${props.hoverOpacity}`)
  if (props.pressedOpacity !== undefined) style.setProperty('--ripple-pressed-opacity', `${props.pressedOpacity}`)
  if (props.duration !== 150) style.setProperty('--ripple-duration', `${props.duration}ms`)
})

const isTouch = ({ pointerType }: PointerEvent) => pointerType === 'touch'

function shouldReactToEvent(event: PointerEvent) {
  const parent = root.value?.parentElement as (HTMLElement & { disabled?: boolean }) | null | undefined
  if (props.disabled || parent?.disabled || !event.isPrimary) return false
  if (rippleStartEvent && rippleStartEvent.pointerId !== event.pointerId) return false
  if (event.type === 'pointerenter' || event.type === 'pointerleave') return !isTouch(event)
  return isTouch(event) || event.buttons === 1
}

function inBounds({ x, y }: PointerEvent) {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return false
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function determineRippleSize() {
  if (!root.value) return
  const { height, width } = root.value.getBoundingClientRect()
  const maxDim = Math.max(height, width)
  const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE)
  initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE)
  const hypotenuse = Math.sqrt(width ** 2 + height ** 2)
  rippleScale = `${(hypotenuse + PADDING + softEdgeSize) / initialSize}`
  rippleSize = `${initialSize}px`
}

function getNormalizedPointerEventCoords(event: PointerEvent) {
  const rect = root.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return { x: event.pageX - (window.scrollX + rect.left), y: event.pageY - (window.scrollY + rect.top) }
}

function getTranslationCoordinates(event?: PointerEvent) {
  const parent = root.value?.parentElement
  if (!parent) return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } }
  const { height, width } = parent.getBoundingClientRect()
  const endPoint = { x: (width - initialSize) / 2, y: (height - initialSize) / 2 }
  // Keyboard activation starts in the centre.
  return { startPoint: event ? getNormalizedPointerEventCoords(event) : endPoint, endPoint }
}

function startPressAnimation(event?: PointerEvent) {
  if (!surface.value) return
  pressed.value = true
  growAnimation?.cancel()
  determineRippleSize()
  const { startPoint, endPoint } = getTranslationCoordinates(event)
  growAnimation = surface.value.animate(
    {
      height: [rippleSize, rippleSize],
      width: [rippleSize, rippleSize],
      transform: [
        `translate(${startPoint.x}px,${startPoint.y}px) scale(1)`,
        `translate(${endPoint.x}px,${endPoint.y}px) scale(${rippleScale})`,
      ],
    },
    { pseudoElement: '::after', duration: props.duration, easing: props.easing, fill: 'forwards' },
  )
}

function endPressAnimation() {
  rippleStartEvent = undefined
  state = State.Inactive
  const animation = growAnimation
  const pressAnimationPlayState = typeof animation?.currentTime === 'number' ? animation.currentTime : Infinity
  if (pressAnimationPlayState >= props.minimumPressDuration) {
    pressed.value = false
    return
  }
  setTimeout(() => {
    if (growAnimation === animation) pressed.value = false
  }, props.minimumPressDuration - pressAnimationPlayState)
}

function onPointerEnter(event: PointerEvent) {
  if (shouldReactToEvent(event)) hovered.value = true
}

function onPointerLeave(event: PointerEvent) {
  if (!shouldReactToEvent(event)) return
  hovered.value = false
  if (state !== State.Inactive) endPressAnimation()
}

function onPointerUp(event: PointerEvent) {
  if (!shouldReactToEvent(event)) return
  if (state === State.Holding) {
    state = State.WaitingForClick
    return
  }
  if (state === State.TouchDelay) {
    state = State.WaitingForClick
    startPressAnimation(rippleStartEvent)
  }
}

function onPointerDown(event: PointerEvent) {
  if (!shouldReactToEvent(event)) return
  rippleStartEvent = event
  if (!isTouch(event)) {
    state = State.WaitingForClick
    startPressAnimation(event)
    return
  }
  if (checkBoundsAfterContextMenu && !inBounds(event)) return
  checkBoundsAfterContextMenu = false
  state = State.TouchDelay
  setTimeout(() => {
    if (state !== State.TouchDelay) return
    state = State.Holding
    startPressAnimation(event)
  }, props.touchDelay)
}

function onClick() {
  if (props.disabled) return
  if (state === State.WaitingForClick) {
    endPressAnimation()
    return
  }
  if (state === State.Inactive) {
    startPressAnimation()
    endPressAnimation()
  }
}

function onPointerCancel(event: PointerEvent) {
  if (shouldReactToEvent(event)) endPressAnimation()
}

function onContextMenu() {
  if (props.disabled) return
  checkBoundsAfterContextMenu = true
  endPressAnimation()
}

const listeners = {
  click: onClick,
  contextmenu: onContextMenu,
  pointercancel: onPointerCancel,
  pointerdown: onPointerDown,
  pointerenter: onPointerEnter,
  pointerleave: onPointerLeave,
  pointerup: onPointerUp,
} as Record<string, (event: any) => void>

let parent: HTMLElement | null | undefined
onMounted(() => {
  parent = root.value?.parentElement
  for (const [type, fn] of Object.entries(listeners)) parent?.addEventListener(type, fn, true)
})
onBeforeUnmount(() => {
  for (const [type, fn] of Object.entries(listeners)) parent?.removeEventListener(type, fn, true)
})
</script>

<template>
  <div ref="root" class="salty-ripple" aria-hidden="true">
    <div ref="surface" :class="['salty-ripple-surface', { '--hover': hovered, '--press': pressed }]" />
  </div>
</template>

<style>
/* m3-ripple@1.1.3 ripple.css, verbatim. */
.salty-ripple {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.salty-ripple[aria-disabled='true'] {
  display: none;
}

@media (forced-colors: active) {
  .salty-ripple {
    display: none;
  }
}

.salty-ripple .salty-ripple-surface {
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
}

.salty-ripple .salty-ripple-surface::before,
.salty-ripple .salty-ripple-surface::after {
  content: '';
  opacity: 0;
  position: absolute;
}

.salty-ripple .salty-ripple-surface::before {
  width: 100%;
  height: 100%;
  background-color: var(--ripple-color, currentColor);
  inset: 0;
  transition:
    opacity var(--ripple-duration, 150ms),
    background-color var(--ripple-duration, 150ms);
}

.salty-ripple .salty-ripple-surface::after {
  inset: 0;
  background: radial-gradient(closest-side, var(--ripple-color, currentColor) max(100% - 70px, 65%), transparent 100%);
  transform-origin: center center;
  transition: opacity 375ms;
}

.salty-ripple .salty-ripple-surface.--hover::before {
  background-color: var(--ripple-color, currentColor);
  opacity: var(--ripple-hover-opacity, 0.08);
}

.salty-ripple .salty-ripple-surface.--press::after {
  opacity: var(--ripple-pressed-opacity, 0.12);
  transition-duration: 75ms;
}
</style>
