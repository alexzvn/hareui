<template>
  <Slider
    :id="id"
    data-slot="cell-slider"
    :model-value="current"
    :default-value="defaultValue"
    :min="min"
    :max="max"
    :step="step"
    :format-options="formatOptions"
    :locale="locale"
    :label="label"
    :disabled="disabled"
    :name="name"
    :required="required"
    orientation="horizontal"
    :ui="{
      base: ui.base({ class: [props.ui?.base, props.class] }),
      track: ui.track({ class: props.ui?.track }),
      fill: ui.fill({ class: props.ui?.fill }),
      thumb: ui.thumb({ class: props.ui?.thumb }),
      label: ui.label({ class: props.ui?.label }),
      output: ui.output({ class: props.ui?.output }),
    }"
    @update:model-value="onUpdate"
    @change-end="emit('changeEnd', $event as number)"
  >
    <template v-if="slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="slots.output" #output="{ values, formatted }">
      <slot name="output" :value="values[0]!" :formatted="formatted[0]!" />
    </template>
  </Slider>
</template>

<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type CellSlider = typeof theme

export type CellSliderProps = {
  /** The current value. Bind with `v-model`. */
  modelValue?: number
  /**
   * The initial value when uncontrolled.
   * @defaultValue min
   */
  defaultValue?: number
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
  /** Formatting options for the value shown at the end of the row (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** The BCP 47 locale used to format the value. Defaults to the browser locale. */
  locale?: string
  /** The text at the start of the row. Also names the slider. */
  label?: string
  /**
   * Visual style of the row. Use `secondary` on a surface or card.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<CellSlider>['variant']
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
  ui?: ComponentSlots<CellSlider>
}

export type CellSliderEmits = {
  /** Emitted when the value changes, on every step of a drag. */
  'update:modelValue': [value: number]
  /** Emitted with the final value when a drag or keyboard step commits a change. */
  changeEnd: [value: number]
}

export type CellSliderSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: () => any
  /** The value shown at the end of the row. Replaces the formatted value. */
  output?: (props: { value: number; formatted: string }) => any
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

import Slider from '@/components/slider/Slider.vue'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<CellSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
})
const emit = defineEmits<CellSliderEmits>()
const slots = defineSlots<CellSliderSlots>()

const ui = useComponentUI('cellSlider', theme, () => ({
  variant: props.variant,
}))
// Always horizontal: the row is the track, so a press anywhere on it moves the value. The root's `data-slot`
// replaces Slider's, so the theme repeats the Slider rule that keys off `[data-slot=slider]`.
// No comment above `<Slider>` in the template: in dev it would make the root a fragment and stop attribute fallthrough.

// Uncontrolled state lives here; Slider sees a controlled value (`undefined` until there is one, so it falls back to `min`)
const local = ref(props.defaultValue)
const current = computed(() => props.modelValue ?? local.value)
function onUpdate(value: number | number[] | undefined) {
  local.value = value as number
  emit('update:modelValue', value as number)
}
</script>
