<template>
  <Primitive :as="as" data-slot="chip" :class="ui.base()">
    <slot name="leading" />
    <span v-if="label !== undefined || !!slots.default" data-slot="chip-label" :class="ui.label()">
      <slot>{{ label }}</slot>
    </span>
    <slot name="trailing" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { ChipProps, ChipSlots } from './Chip.types'
import theme from './theme'

const props = withDefaults(defineProps<ChipProps>(), { as: 'span' })
const slots = defineSlots<ChipSlots>()

const ui = useComponentUI('chip', {
  theme,
  variantProps: () => ({
    color: props.color,
    variant: props.variant,
    size: props.size,
  }),
  props,
})
</script>
