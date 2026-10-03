<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/slider'

type Slider = typeof theme

export interface SliderProps {
  /**
   * The current value(s). Bind with `v-model`. A plain number renders a single thumb; an array
   * renders one thumb per value (e.g. a two-element array for a range slider).
   */
  modelValue?: number | number[]
  /**
   * The initial value(s) when uncontrolled (no `v-model`).
   * @defaultValue 0
   */
  defaultValue?: number | number[]
  /**
   * The slider's minimum value.
   * @defaultValue 0
   */
  min?: number
  /**
   * The slider's maximum value.
   * @defaultValue 100
   */
  max?: number
  /**
   * The amount the value changes per step.
   * @defaultValue 1
   */
  step?: number
  /** Formatting options for the displayed value label (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** The BCP 47 locale used to format the value label. Defaults to the browser locale. */
  locale?: string
  /**
   * The axis the slider is laid out along.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /** The slider's label. */
  label?: string
  /**
   * Whether the slider is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** The name of the slider, used when submitting an HTML form. */
  name?: string
  /**
   * Whether a value is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** The id of the slider. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Slider>
}

export interface SliderSlots {
  /** The label content. Replaces the `label` prop. */
  label?: () => any
  /** The output content, showing the formatted current value(s). Replaces the default `' – '`-joined format. */
  output?: (props: { values: number[], formatted: string[] }) => any
}
</script>

<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed, ref, useId, useSlots } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Label from './Label.vue'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
})
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
function toArray(value: number | number[] | undefined): number[] | undefined {
  if (value === undefined)
    return undefined
  return Array.isArray(value) ? value : [value]
}
const isRange = computed(() => Array.isArray(modelValue.value ?? props.defaultValue))
// Always pass an explicit `model-value` to Reka (never `undefined`) so it treats the slider as fully
// controlled, the same technique Checkbox/RadioGroup use to avoid Reka owning uncontrolled state itself.
const current = computed<number[]>(() => toArray(modelValue.value ?? props.defaultValue) ?? [props.min])

function onUpdate(values: number[] | undefined) {
  if (!values)
    return
  modelValue.value = isRange.value ? [...values] : values[0]
}
function onCommit(values: number[]) {
  emit('changeEnd', isRange.value ? [...values] : values[0])
}

const formatter = computed(() => new Intl.NumberFormat(props.locale, props.formatOptions))
const formattedValues = computed(() => current.value.map(v => formatter.value.format(v)))
const outputText = computed(() => formattedValues.value.join(' – '))

// `data-fill-start` / `data-fill-end` on the track replicate `@heroui/react`'s `SliderTrack` exactly
// (a single thumb fills from its edge toward the value; a range fills between its two thumbs).
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
function fraction(value: number) {
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
const fillStart = computed(() => isSingleThumb.value ? fillFraction.value > 0 : sortedEdges.value[0] === 0)
const fillEnd = computed(() => isSingleThumb.value ? fillFraction.value === 1 : sortedEdges.value[0] + fillFraction.value === 1)

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
function onPointerDownCapture() {
  pointerActive = true
  focusVisibleIndex.value = -1
}
function onPointerDown() {
  if (!props.disabled)
    isSliding.value = true
}
function onPointerEnd() {
  isSliding.value = false
  pointerActive = false
}
function onThumbFocus(index: number) {
  activeThumbIndex.value = index
  focusVisibleIndex.value = pointerActive ? -1 : index
}
function onThumbKeydown(index: number) {
  pointerActive = false
  focusVisibleIndex.value = index
}
function onThumbBlur() {
  focusVisibleIndex.value = -1
}
function dragging(index: number) {
  return isSliding.value && activeThumbIndex.value === index ? 'true' : undefined
}
</script>

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
    :disabled="disabled"
    :name="name"
    :required="required"
    data-slot="slider"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @value-commit="onCommit"
    @pointerdown.capture="onPointerDownCapture"
    @pointerdown="onPointerDown"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
  >
    <Label v-if="hasLabel" :id="labelId" :disabled="disabled" :class="ui.label({ class: props.ui?.label })">
      <slot name="label">{{ label }}</slot>
    </Label>
    <output data-slot="slider-output" :data-orientation="orientation" :class="ui.output({ class: props.ui?.output })">
      <slot name="output" :values="current" :formatted="formattedValues">{{ outputText }}</slot>
    </output>
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
        v-for="(value, index) in current"
        :key="index"
        data-slot="slider-thumb"
        :data-dragging="dragging(index)"
        :data-focus-visible="focusVisibleIndex === index ? 'true' : undefined"
        :class="ui.thumb({ class: props.ui?.thumb })"
        @focus="onThumbFocus(index)"
        @blur="onThumbBlur"
        @keydown="onThumbKeydown(index)"
      />
    </SliderTrack>
  </SliderRoot>
</template>
