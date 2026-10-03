<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/chip'

type Chip = typeof theme

export interface ChipProps {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Chip>
}

export interface ChipSlots {
  /** Content rendered before the label (e.g. an icon or status dot). */
  leading?: () => any
  /** The chip label. Wrapped in the `label` element. */
  default?: () => any
  /** Content rendered after the label. */
  trailing?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useComponentUI } from '../composables/useComponentUI'

const props = withDefaults(defineProps<ChipProps>(), { as: 'span' })
const slots = defineSlots<ChipSlots>()

const ui = useComponentUI('chip', theme, () => ({ color: props.color, variant: props.variant, size: props.size }))
</script>

<template>
  <Primitive :as="as" data-slot="chip" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="leading" />
    <span v-if="label !== undefined || !!slots.default" data-slot="chip-label" :class="ui.label({ class: props.ui?.label })">
      <slot>{{ label }}</slot>
    </span>
    <slot name="trailing" />
  </Primitive>
</template>
