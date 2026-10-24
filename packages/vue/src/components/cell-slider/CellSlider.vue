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

<script setup lang="ts">
import { computed, ref } from 'vue'

import Slider from '@/components/slider/Slider.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { CellSliderProps, CellSliderEmits, CellSliderSlots } from './CellSlider.types'
import theme from './theme'

const props = withDefaults(defineProps<CellSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
})

const emit = defineEmits<CellSliderEmits>()
const slots = defineSlots<CellSliderSlots>()

const ui = useComponentUI('cellSlider', {
  theme,
  variantProps: () => ({
    variant: props.variant,
  }),
})

// Always horizontal: the row is the track, so a press anywhere on it moves the value. The root's `data-slot`
// replaces Slider's, so the theme repeats the Slider rule that keys off `[data-slot=slider]`.
// No comment above `<Slider>` in the template: in dev it would make the root a fragment and stop attribute fallthrough.

// Uncontrolled state lives here; Slider sees a controlled value (`undefined` until there is one, so it falls back to `min`)
const local = ref(props.defaultValue)
const current = computed(() => props.modelValue ?? local.value)

const onUpdate = (value: number | number[] | undefined) => {
  local.value = value as number
  emit('update:modelValue', value as number)
}
</script>
