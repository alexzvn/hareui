<template>
  <Primitive
    :as="as"
    v-bind="rootAttrs"
    :data-hovered="state.isHovered ? 'true' : undefined"
    :data-pressed="state.isPressed ? 'true' : undefined"
    :data-holding="slotProps.holding ? 'true' : undefined"
    :data-progressing="slotProps.progressing ? 'true' : undefined"
    :data-complete="slotProps.complete ? 'true' : undefined"
    :class="ui.base({ class: 'relative' })"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @pointerup="onPointerRelease"
    @pointercancel="onPointerRelease"
    @keydown="onKeydown"
    @keyup="onKeyup"
    @blur="endPress"
    @click="onClick"
    @contextmenu="onContextMenu"
  >
    <span
      v-if="rippleOptions"
      aria-hidden="true"
      data-slot="pressable-feedback-ripple"
      :style="{
        '--pressable-feedback-ripple-duration': `${rippleOptions.duration}ms`,
        '--pressable-feedback-hover-opacity': rippleOptions.hoverOpacity,
        '--pressable-feedback-pressed-opacity': rippleOptions.pressedOpacity,
      }"
      :class="ui.ripple({ class: 'pointer-events-none absolute inset-0 overflow-hidden' })"
    >
      <span
        v-for="wave in ripple.waves.value"
        :key="wave.id"
        :data-wave="wave.id"
        :data-released="wave.phase === 'released' ? 'true' : undefined"
        :style="{ width: `${wave.size}px`, height: `${wave.size}px`, transform: wave.to }"
        :class="ui.rippleWave({ class: 'pointer-events-none absolute top-0 left-0' })"
      />
    </span>

    <span
      v-if="highlightOptions"
      aria-hidden="true"
      data-slot="pressable-feedback-highlight"
      :style="{
        '--pressable-feedback-hover-opacity': highlightOptions.hoverOpacity,
        '--pressable-feedback-pressed-opacity': highlightOptions.pressedOpacity,
      }"
      :class="ui.highlight()"
    />

    <slot v-bind="slotProps" />

    <span
      v-if="holdOptions"
      aria-hidden="true"
      data-slot="pressable-feedback-hold"
      :data-state="state.hold"
      :data-sweep="holdOptions.sweep"
      :style="{
        '--pressable-feedback-duration': `${holdOptions.duration}ms`,
        '--pressable-feedback-release-duration': `${holdOptions.releaseDuration}ms`,
      }"
      :class="ui.hold()"
    >
      <slot name="hold" v-bind="slotProps">
        <slot v-bind="slotProps" />
      </slot>
    </span>

    <span
      v-if="progressOptions"
      aria-hidden="true"
      data-slot="pressable-feedback-progress"
      :data-state="state.progress"
      :data-sweep="progressOptions.sweep"
      :style="{
        '--pressable-feedback-duration': `${progressOptions.duration}ms`,
        '--pressable-feedback-release-duration': `${progressOptions.releaseDuration}ms`,
      }"
      :class="ui.progress()"
    >
      <slot name="progress" v-bind="slotProps">
        <slot v-bind="slotProps" />
      </slot>
    </span>
  </Primitive>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { Primitive } from 'reka-ui'
import { computed, onBeforeUnmount, shallowReactive, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  PressableFeedbackEmits,
  PressableFeedbackHighlight,
  PressableFeedbackHold,
  PressableFeedbackProgress,
  PressableFeedbackProps,
  PressableFeedbackRipple,
  PressableFeedbackSlotProps,
  PressableFeedbackSlots,
} from './PressableFeedback.types'
import theme from './theme'
import { usePressableRipple } from './usePressableRipple'

const props = withDefaults(defineProps<PressableFeedbackProps>(), {
  as: 'button',
  disabled: false,
  ripple: false,
  highlight: false,
  hold: false,
  progress: false,
})

const emit = defineEmits<PressableFeedbackEmits>()

defineSlots<PressableFeedbackSlots>()

const RIPPLE_DEFAULTS: Required<PressableFeedbackRipple> = {
  duration: 150,
  hoverOpacity: 0.08,
  pressedOpacity: 0.12,
  minimumPressDuration: 225,
}

const HIGHLIGHT_DEFAULTS: Required<PressableFeedbackHighlight> = {
  hoverOpacity: 0.08,
  pressedOpacity: 0.12,
}

const HOLD_DEFAULTS: Required<PressableFeedbackHold> = {
  duration: 2000,
  releaseDuration: 200,
  sweep: 'right',
  resetOnComplete: true,
}

const PROGRESS_DEFAULTS: Required<PressableFeedbackProgress> = {
  duration: 2000,
  releaseDuration: 300,
  sweep: 'right',
  autoReset: true,
  resetDelay: 1500,
}

const PRESS_KEYS = new Set([' ', 'Enter'])

// `true` turns an effect on with its defaults; an object overrides them key by key.
const resolveOptions = <T extends object>(value: boolean | T, defaults: Required<T>) => {
  if (!value) return undefined

  return defu(value === true ? {} : value, defaults) as Required<T>
}

const rippleOptions = computed(() => resolveOptions(props.ripple, RIPPLE_DEFAULTS))
const highlightOptions = computed(() => resolveOptions(props.highlight, HIGHLIGHT_DEFAULTS))
const holdOptions = computed(() => resolveOptions(props.hold, HOLD_DEFAULTS))
const progressOptions = computed(() => resolveOptions(props.progress, PROGRESS_DEFAULTS))

const ui = useComponentUI('pressableFeedback', {
  theme,
  variantProps: () => ({
    holdSweep: holdOptions.value?.sweep,
    progressSweep: progressOptions.value?.sweep,
  }),
  props,
})

const state = shallowReactive({
  isHovered: false,
  isPressed: false,
  hold: 'idle' as 'idle' | 'holding' | 'complete',
  progress: 'idle' as 'idle' | 'progressing' | 'complete',
})

const ripple = usePressableRipple(() => rippleOptions.value ?? RIPPLE_DEFAULTS)

type Timer = ReturnType<typeof setTimeout> | undefined

// Pending timeouts of the hold, the progress sweep and the progress auto-reset.
const timers: Record<'hold' | 'progress' | 'reset', Timer> = {
  hold: undefined,
  progress: undefined,
  reset: undefined,
}

// The pointer or key that started the current press; only its release ends it.
let pressPointerId: number | undefined
let pressKey: string | undefined

const resetHold = () => {
  if (state.hold !== 'complete') return

  state.hold = 'idle'
  emit('reset')
}

const resetProgress = () => {
  clearTimeout(timers.reset)
  if (state.progress !== 'complete') return

  state.progress = 'idle'
  emit('reset')
}

const reset = () => {
  resetHold()
  resetProgress()
}

const slotProps = computed((): PressableFeedbackSlotProps => ({
  holding: state.hold === 'holding',
  progressing: state.progress === 'progressing',
  complete: state.hold === 'complete' || state.progress === 'complete',
  reset,
}))

const startHold = () => {
  const options = holdOptions.value
  if (!options || state.hold !== 'idle') return

  state.hold = 'holding'

  timers.hold = setTimeout(() => {
    state.hold = 'complete'
    emit('confirm')
  }, options.duration)
}

// Released before the full duration, the hold is cancelled and the overlay snaps back; released after it, a
// confirmed hold resets unless `resetOnComplete` is off.
const endHold = () => {
  clearTimeout(timers.hold)

  if (state.hold === 'holding') {
    state.hold = 'idle'
    return
  }

  if (holdOptions.value?.resetOnComplete) resetHold()
}

const startPress = ({ el, point }: { el: HTMLElement; point?: { x: number; y: number } }) => {
  state.isPressed = true
  if (rippleOptions.value) ripple.press(el, point)
  startHold()
}

const endPress = () => {
  if (!state.isPressed) return

  state.isPressed = false
  pressPointerId = undefined
  pressKey = undefined
  ripple.release()
  endHold()
}

const onPointerEnter = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') state.isHovered = true
}

const onPointerLeave = (event: PointerEvent) => {
  state.isHovered = false
  if (event.pointerId === pressPointerId) endPress()
}

const onPointerDown = (event: PointerEvent) => {
  if (props.disabled || event.button !== 0 || state.isPressed) return
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()

  pressPointerId = event.pointerId
  startPress({ el, point: { x: event.clientX - rect.left, y: event.clientY - rect.top } })
}

const onPointerRelease = (event: PointerEvent) => {
  if (event.pointerId === pressPointerId) endPress()
}

// A long touch press would open the context menu (or text selection) halfway through a hold.
const onContextMenu = (event: MouseEvent) => {
  if (state.isPressed && holdOptions.value) event.preventDefault()
}

const onClick = () => {
  const options = progressOptions.value
  if (props.disabled || !options || state.progress !== 'idle') return

  state.progress = 'progressing'

  timers.progress = setTimeout(() => {
    state.progress = 'complete'
    emit('complete')
    if (options.autoReset) timers.reset = setTimeout(resetProgress, options.resetDelay)
  }, options.duration)
}

const isNativeButton = computed(() => props.as === 'button')

// A plain element other than a button gets the button role and keys; a component handles its own.
const isPlainElement = computed(() => typeof props.as === 'string' && !isNativeButton.value)

// A component keeps its own `data-slot` (a `Button` inside a `ButtonGroup` is styled by it).
const rootAttrs = computed(() => {
  if (isNativeButton.value) {
    return {
      'data-slot': 'pressable-feedback',
      type: 'button',
      disabled: props.disabled || undefined,
    }
  }

  if (!isPlainElement.value) return { disabled: props.disabled || undefined }

  return {
    'data-slot': 'pressable-feedback',
    role: 'button',
    tabindex: props.disabled ? -1 : 0,
    'aria-disabled': props.disabled ? 'true' : undefined,
  }
})

// Button keys on a plain element: Enter clicks on keydown, Space on keyup, and Space doesn't scroll the page. An
// anchor with an `href` already clicks on Enter.
const clickOnKeydown = (event: KeyboardEvent) => {
  if (!isPlainElement.value) return

  if (event.key === ' ') {
    event.preventDefault()
    return
  }

  const el = event.currentTarget as HTMLElement
  const isAnchor = el instanceof HTMLAnchorElement && el.hasAttribute('href')
  if (isAnchor) return

  event.preventDefault()
  if (!event.repeat) el.click()
}

const onKeydown = (event: KeyboardEvent) => {
  const isOwnKey = event.target === event.currentTarget && PRESS_KEYS.has(event.key)
  if (props.disabled || !isOwnKey) return

  clickOnKeydown(event)
  if (event.repeat || state.isPressed) return

  pressKey = event.key
  startPress({ el: event.currentTarget as HTMLElement })
}

const onKeyup = (event: KeyboardEvent) => {
  if (event.key !== pressKey) return
  const shouldClick = isPlainElement.value && event.key === ' '

  endPress()
  if (!shouldClick) return

  event.preventDefault()
  ;(event.currentTarget as HTMLElement).click()
}

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled) endPress()
  },
)

onBeforeUnmount(() => {
  clearTimeout(timers.hold)
  clearTimeout(timers.progress)
  clearTimeout(timers.reset)
})

defineExpose({ reset })
</script>
