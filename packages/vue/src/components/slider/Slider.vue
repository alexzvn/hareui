<template>
  <SliderRoot
    :id="id"
    as="div"
    thumb-alignment="overflow"
    :model-value="current"
    :min="min"
    :max="max"
    :step="step"
    :orientation="orientation"
    :disabled="isDisabled"
    :required="required"
    data-slot="slider"
    role="group"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @value-commit="onCommit"
    @pointerdown.capture="onPointerDownCapture"
    @pointerdown="onPointerDown"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @gotpointercapture="captureOnDraggedThumb"
  >
    <!-- Split so slot content is only forwarded (and force-updated) when the slot is actually passed. -->
    <Label
      v-if="hasLabel && $slots.label"
      :id="labelId"
      :disabled="isDisabled"
      :class="ui.label({ class: props.ui?.label })"
    >
      <slot name="label">{{ label }}</slot>
    </Label>
    <Label
      v-else-if="hasLabel"
      :id="labelId"
      :disabled="isDisabled"
      :class="ui.label({ class: props.ui?.label })"
      >{{ label }}</Label
    >
    <output
      v-if="$slots.output"
      data-slot="slider-output"
      aria-live="off"
      :data-orientation="orientation"
      :class="ui.output({ class: props.ui?.output })"
    >
      <slot name="output" :values="current" :formatted="formattedValues">{{ outputText }}</slot>
    </output>
    <output
      v-else
      data-slot="slider-output"
      aria-live="off"
      :data-orientation="orientation"
      :class="ui.output({ class: props.ui?.output })"
      >{{ outputText }}</output
    >
    <SliderTrack
      data-slot="slider-track"
      :data-fill-start="fillStart ? 'true' : undefined"
      :data-fill-end="fillEnd ? 'true' : undefined"
      :class="ui.track({ class: props.ui?.track })"
    >
      <!-- RAC sizes the fill with an explicit width/height (Reka only sets both edges, which rounds differently) -->
      <SliderRange
        data-slot="slider-fill"
        :style="{ [orientation === 'vertical' ? 'height' : 'width']: `${fillFraction * 100}%` }"
        :class="ui.fill({ class: props.ui?.fill })"
      />
      <SliderThumb
        v-for="index in current.keys()"
        :key="index"
        data-slot="slider-thumb"
        :data-dragging="dragging(index)"
        :data-focus-visible="focusVisibleIndex === index ? 'true' : undefined"
        :ref="
          (el: any) => {
            thumbRefs[index] = el
          }
        "
        :aria-labelledby="hasLabel ? labelId : undefined"
        :aria-label="hasLabel ? undefined : ($attrs['aria-label'] as string | undefined)"
        :aria-valuetext="formattedValues[index]"
        :aria-disabled="isDisabled ? 'true' : undefined"
        :class="ui.thumb({ class: props.ui?.thumb })"
        @focus="onThumbFocus(index)"
        @blur="onThumbBlur"
        @keydown="onThumbKeydown($event, index)"
      />
    </SliderTrack>
    <!-- RAC submits one entry per thumb under the plain `name` (Reka would post `name[0]`, `name[1]`) -->
    <template v-if="name">
      <input
        v-for="(value, index) in current"
        :key="index"
        type="hidden"
        :name="name"
        :value="value"
        :disabled="isDisabled"
      />
    </template>
  </SliderRoot>
</template>

<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed, ref, useId, useSlots } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import Label from '@/components/label/Label.vue'
import { captureOnDraggedThumb } from '@/composables/thumbPointerCapture'
import { useComponentUI } from '@/composables/useComponentUI'
import { clamp, snapValueToStep } from '@/utils/number'

import type { SliderProps, SliderSlots } from './Slider.types'
import theme from './theme'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
})

const isDisabled = useFieldsetDisabled(() => props.disabled)
const modelValue = defineModel<number | number[]>()

const emit = defineEmits<{
  /** Emitted with the final value when an interaction (pointer drag or keyboard step) commits a change. */
  changeEnd: [value: number | number[]]
}>()

defineSlots<SliderSlots>()
const slots = useSlots()

const ui = useComponentUI('slider', theme, () => ({}))

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const labelId = computed(() => `${id.value}-label`)
const hasLabel = computed(() => !!(props.label || slots.label))

// Reka's `SliderRoot` always works with `number[]`; a plain number renders a single thumb, an array a range.
const toArray = (value: number | number[] | undefined): number[] | undefined => {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value : [value]
}

const isRange = computed(() => Array.isArray(modelValue.value ?? props.defaultValue))

// Always pass an explicit `model-value` to Reka (never `undefined`) so it treats the slider as fully
// controlled, the same technique Checkbox/RadioGroup use to avoid Reka owning uncontrolled state itself.
// Values outside `[min, max]` are clamped, as RAC does.
const current = computed<number[]>(() =>
  (toArray(modelValue.value ?? props.defaultValue) ?? [props.min]).map((v) =>
    clamp(v, props.min, props.max),
  ),
)

// RAC keeps every thumb between its neighbours (`getThumbMinValue` / `getThumbMaxValue`). Reka instead sorts the
// values and hands the move over to the other thumb, so a thumb pushed past its neighbour swaps with it. Reka
// changes one value per update, so recover that value from the sorted result and clamp it onto the thumb that
// is actually moving (the focused one, or the one a pointer interaction started on).
let movingIndex: number | null = null
const thumbRefs = ref<Array<{ $el: HTMLElement } | null>>([])

const thumbMin = (values: number[], index: number) => {
  return index > 0 ? values[index - 1]! : props.min
}

const thumbMax = (values: number[], index: number) => {
  return index < values.length - 1 ? values[index + 1]! : props.max
}

const changedValue = (previous: number[], next: number[]): number | undefined => {
  const rest = [...previous]
  for (const value of next) {
    const at = rest.indexOf(value)
    if (at === -1) return value
    rest.splice(at, 1)
  }

  return undefined
}

const constrain = (values: number[]): number[] => {
  const previous = current.value
  movingIndex ??= activeThumbIndex.value
  const index = movingIndex
  if (values.length < 2 || values.length !== previous.length || index >= previous.length)
    return values

  const value = changedValue(previous, values)
  if (value === undefined) return previous
  const next = [...previous]
  next[index] = clamp(value, thumbMin(previous, index), thumbMax(previous, index))

  return next
}

const onUpdate = (values: number[] | undefined) => {
  if (!values) return
  const next = constrain(values)

  // Reka focuses the thumb it handed the move to; keep focus on the thumb that is moving.
  if (
    next.length > 1 &&
    movingIndex !== null &&
    document.activeElement !== thumbRefs.value[movingIndex]?.$el
  )
    thumbRefs.value[movingIndex]?.$el?.focus?.()

  modelValue.value = isRange.value ? [...next] : next[0]
}

// Reka emits `valueCommit` before `update:modelValue`, so report the committed values rather than `current`
const onCommit = (values: number[]) => {
  const next = constrain(values)
  emit('changeEnd', isRange.value ? [...next] : next[0]!)
}

// RAC's page size is a tenth of the range (at least one step), used by PageUp / PageDown and Shift + Arrow, and
// Home / End move the focused thumb to the edge of its own allowed range. Reka pages by 10 × step and always
// moves the first / last thumb on Home / End.
const pageSize = computed(() => {
  const range = props.max - props.min
  return Math.max(props.step, Math.round(range / 10 / props.step) * props.step || props.step)
})

// +1 / -1 for a key that pages the value, 0 for keys left to Reka (plain arrows, which only step)
const pageDirection = (event: KeyboardEvent): number => {
  if (event.key === 'PageUp') return 1
  if (event.key === 'PageDown') return -1
  if (!event.shiftKey || !event.key.startsWith('Arrow')) return 0

  // Reka reads the direction from the `dir` it renders on the root
  const rtl =
    props.orientation === 'horizontal' &&
    (event.currentTarget as Element).closest('[dir]')?.getAttribute('dir') === 'rtl'

  const decrease = event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')

  return decrease ? -1 : 1
}

const onThumbKeydown = (event: KeyboardEvent, index: number) => {
  pointerActive = false
  focusVisibleIndex.value = index
  movingIndex = index
  activeThumbIndex.value = index
  const page = pageDirection(event)
  if (isDisabled.value || (page === 0 && event.key !== 'Home' && event.key !== 'End')) return

  // Handled here instead of by Reka's root keydown handler
  event.preventDefault()
  event.stopPropagation()
  const values = current.value
  const low = thumbMin(values, index)
  const high = thumbMax(values, index)

  // The page snaps relative to `min` but not limited by `max`: the clamp below limits it to the thumb's own range,
  // so a `max` off the step grid stays reachable
  const target =
    event.key === 'Home'
      ? low
      : event.key === 'End'
        ? high
        : snapValueToStep(values[index]! + page * pageSize.value, props.min, undefined, props.step)

  const next = [...values]
  next[index] = clamp(target, low, high)
  if (next[index] === values[index]) return
  modelValue.value = isRange.value ? next : next[0]
  emit('changeEnd', isRange.value ? [...next] : next[0]!)
}

const formatter = computed(() => new Intl.NumberFormat(props.locale, props.formatOptions))
const formattedValues = computed(() => current.value.map((v) => formatter.value.format(v)))
const outputText = computed(() => formattedValues.value.join(' – '))

// `data-fill-start` / `data-fill-end` on the track replicate `@heroui/react`'s `SliderTrack` exactly
// (a single thumb fills from its edge toward the value; a range fills between its two thumbs).
const fraction = (value: number) => {
  const range = props.max - props.min
  return range <= 0 ? 0 : clamp((value - props.min) / range, 0, 1)
}

const sortedEdges = computed(() => {
  const values = current.value
  const start = values.length > 1 ? fraction(values[0]) : 0
  const end = fraction(values[values.length - 1] ?? props.min)

  return [start, end].sort((a, b) => a - b)
})

const fillFraction = computed(() => sortedEdges.value[1] - sortedEdges.value[0])
const isSingleThumb = computed(() => current.value.length === 1)
const fillStart = computed(() =>
  isSingleThumb.value ? fillFraction.value > 0 : sortedEdges.value[0] === 0,
)

const fillEnd = computed(() =>
  isSingleThumb.value ? fillFraction.value === 1 : sortedEdges.value[0] + fillFraction.value === 1,
)

// reka-limitation: unlike RAC's `SliderThumb`, Reka's thumb exposes no `isDragging` state, so HareUI
// tracks it itself. A pointer interaction anywhere on the slider starts a drag; the currently-focused
// thumb is the one being moved, because Reka focuses the active thumb as soon as its value changes
// (including when the drag starts on the track rather than a thumb).
// The same programmatic focus makes `:focus-visible` match on a mouse press, so `data-focus-visible` is
// tracked like RAC's: set by keyboard focus/keys, suppressed while a pointer interaction is in progress.
const isSliding = ref(false)
const activeThumbIndex = ref(0)
const focusVisibleIndex = ref(-1)
let pointerActive = false
const onPointerDownCapture = () => {
  pointerActive = true
  focusVisibleIndex.value = -1

  // Reka focuses the thumb closest to the press (unless it already has focus) before its first update; that
  // thumb is the one to move, picked up in `onUpdate`
  movingIndex = null
}

const onPointerDown = () => {
  if (!isDisabled.value) isSliding.value = true
}

const onPointerEnd = () => {
  isSliding.value = false
  pointerActive = false
}

const onThumbFocus = (index: number) => {
  // While a thumb is moving, Reka may focus its neighbour (it hands crossing moves over); `onUpdate` moves focus back
  if (movingIndex === null) activeThumbIndex.value = index
  focusVisibleIndex.value = pointerActive ? -1 : index
}

const onThumbBlur = () => {
  focusVisibleIndex.value = -1
}

const dragging = (index: number) => {
  return isSliding.value && activeThumbIndex.value === index ? 'true' : undefined
}
</script>
