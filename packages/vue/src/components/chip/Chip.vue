<template>
  <Primitive :as="as" data-slot="chip" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" />
    <span
      v-if="label !== undefined || !!slots.default"
      data-slot="chip-label"
      :class="ui.label({ class: props.ui?.label })"
    >
      <slot>{{ label }}</slot>
    </span>
    <slot name="trailing" />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Chip = typeof theme

export type ChipProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'span'
   */
  as?: PrimitiveProps['as']
  /** Text rendered inside the chip label. */
  label?: string | number
  /**
   * Color of the chip.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<Chip>['color']
  /**
   * Visual style of the chip.
   * @defaultValue 'secondary'
   */
  variant?: ComponentVariants<Chip>['variant']
  /**
   * Size of the chip.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Chip>['size']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Chip>
}

export type ChipSlots = {
  /** Content rendered before the label (e.g. an icon or status dot). */
  leading?: () => VNode[]
  /** The chip label. Wrapped in the `label` element. */
  default?: () => VNode[]
  /** Content rendered after the label. */
  trailing?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<ChipProps>(), { as: 'span' })
const slots = defineSlots<ChipSlots>()

const ui = useComponentUI('chip', theme, () => ({
  color: props.color,
  variant: props.variant,
  size: props.size,
}))
</script>
