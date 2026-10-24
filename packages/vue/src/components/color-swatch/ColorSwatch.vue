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

<script setup lang="ts">
import { ColorSwatch as ColorSwatchPrimitive } from 'reka-ui'
import { computed } from 'vue'

import { useColorPickerContext } from '@/components/color-picker/context'
import { useComponentUI } from '@/composables/useComponentUI'

import type { ColorSwatchProps, ColorSwatchSlots } from './ColorSwatch.types'
import theme from './theme'

const props = defineProps<ColorSwatchProps>()
defineSlots<ColorSwatchSlots>()

const ctx = useColorPickerContext()

const resolvedColor = computed(() => (props.color !== undefined ? props.color : ctx?.color.value))

const ui = useComponentUI('colorSwatch', theme, () => ({
  shape: props.shape,
  size: props.size,
}))
</script>
