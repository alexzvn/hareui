<template>
  <div
    data-slot="cell-color-picker"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <ColorPicker
      :model-value="modelValue"
      :default-value="defaultValue"
      :open="open"
      :default-open="defaultOpen"
      :side="side"
      :align="align"
      :portal="portal"
      :disabled="disabled"
      :ui="{
        base: 'flex w-full',
        trigger: ui.trigger({ class: props.ui?.trigger }),
        popover: ui.popover({ class: props.ui?.popover }),
      }"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
    >
      <template #trigger="{ color }">
        <span data-slot="cell-color-picker-label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label">
            {{ label }}
          </slot>
        </span>
        <span
          data-slot="cell-color-picker-value-display"
          :class="ui.valueDisplay({ class: props.ui?.valueDisplay })"
        >
          <slot name="value" :color="color" :hex="toHex(color)">
            {{ toHex(color) }}
          </slot>
        </span>
        <ColorSwatch :class="ui.swatch({ class: props.ui?.swatch })" />
      </template>
      <template #default="{ color, close }">
        <slot :color="color" :close="close">
          <ColorSwatchPicker
            v-if="presets?.length"
            :items="presets"
            aria-label="Color presets"
            size="xs"
            :ui="{ indicator: 'hidden' }"
            :class="ui.presets({ class: props.ui?.presets })"
          />
          <ColorArea
            aria-label="Color area"
            class="max-w-full"
            color-space="hsb"
            :x="{ channel: 'saturation' }"
            :y="{ channel: 'brightness' }"
          />
          <ColorSlider
            channel="hue"
            class="gap-1 px-1"
            color-space="hsb"
            label="Hue"
            :ui="{ output: 'text-muted' }"
          />
        </slot>
      </template>
    </ColorPicker>
  </div>
</template>

<script setup lang="ts">
import type { Color } from 'reka-ui'
import { colorToString } from 'reka-ui'

import ColorArea from '@/components/color-area/ColorArea.vue'
import ColorPicker from '@/components/color-picker/ColorPicker.vue'
import ColorSlider from '@/components/color-slider/ColorSlider.vue'
import ColorSwatchPicker from '@/components/color-swatch-picker/ColorSwatchPicker.vue'
import ColorSwatch from '@/components/color-swatch/ColorSwatch.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'

import type {
  CellColorPickerProps,
  CellColorPickerSlots,
  CellColorPickerEmits,
} from './CellColorPicker.types'
import theme from './theme'

// `open: undefined` keeps an absent `open` uncontrolled
const props = withDefaults(defineProps<CellColorPickerProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  portal: undefined,
  variant: 'default',
  side: 'bottom',
  align: 'end',
})

const emit = defineEmits<CellColorPickerEmits>()
defineSlots<CellColorPickerSlots>()

const ui = useComponentUI('cellColorPicker', {
  theme,
  variantProps: () => ({ variant: props.variant }),
})

const disabled = useFieldsetDisabled(() => props.disabled)

// React Aria's `color.toString('hex')`: uppercase, no alpha
const toHex = (color: Color) => colorToString(color, 'hex').slice(0, 7).toUpperCase()
</script>
