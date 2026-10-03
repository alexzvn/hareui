<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Label = typeof theme

export interface LabelProps {
  /** The id of the form control the label is associated with. */
  for?: string
  /**
   * Whether the label is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the label is in an invalid state.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the label shows a required asterisk.
   * @defaultValue false
   */
  required?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Label>
}

export interface LabelSlots {
  /** The label content. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Label } from 'reka-ui'
import { useComponentUI } from '../../composables/useComponentUI'

const props = defineProps<LabelProps>()
defineSlots<LabelSlots>()

const ui = useComponentUI('label', theme, () => ({
  disabled: props.disabled,
  invalid: props.invalid,
  required: props.required,
}))
</script>

<template>
  <Label :for="props.for" data-slot="label" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </Label>
</template>
