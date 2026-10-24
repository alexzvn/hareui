<!-- React Aria's useColorSwatch sets an inline `background-color` of the colour; mirror it so the computed style matches. -->
<template>
  <ColorSwatchPrimitive
    :color="resolvedColor"
    :label="colorName"
    data-slot="color-swatch"
    :style="{ backgroundColor: 'var(--reka-color-swatch-color)' }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ColorSwatchPrimitive>
</template>

<script lang="ts">
import type { Color } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type ColorSwatch = typeof theme

export interface ColorSwatchProps {
  /**
   * The color to display, as a hex/CSS color string or a `Color` object.
   * When omitted and used inside a `ColorPicker`, falls back to its current color.
   */
  color?: string | Color
  /** Accessible name for the color, overriding the automatically derived color name. */
  colorName?: string
  /**
   * Shape of the swatch.
   * @defaultValue 'circle'
   */
  shape?: ComponentVariants<ColorSwatch>['shape']
  /**
   * Size of the swatch.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ColorSwatch>['size']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSwatch>
}

export interface ColorSwatchSlots {
  /** Replaces the swatch content. Receives the resolved color as a CSS string and its alpha channel (0–1). */
  default?: (props: { color: string; alpha: number }) => any
}
</script>

<script setup lang="ts">
import { ColorSwatch as ColorSwatchPrimitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useColorPickerContext } from '../color-picker/context'

const props = defineProps<ColorSwatchProps>()
defineSlots<ColorSwatchSlots>()

const ctx = useColorPickerContext()

const resolvedColor = computed(() => (props.color !== undefined ? props.color : ctx?.color.value))

const ui = useComponentUI('colorSwatch', theme, () => ({
  shape: props.shape,
  size: props.size,
}))
</script>
