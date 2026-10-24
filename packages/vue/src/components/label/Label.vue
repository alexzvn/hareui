<template>
  <component
    :is="as"
    :for="as === 'label' ? props.for : undefined"
    data-slot="label"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @mousedown="onMousedown"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type Label = typeof theme

export type LabelProps = {
  /**
   * The element or component to render as. Use `span` for a group label named via `aria-labelledby`, which has no single control for `for`.
   * @defaultValue 'label'
   */
  as?: PrimitiveProps['as']
  /** The id of the form control the label is associated with. Only applied when rendered as a `label`. */
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

export type LabelSlots = {
  /** The label content. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<LabelProps>(), { as: 'label' })
defineSlots<LabelSlots>()

const ui = useComponentUI('label', theme, () => ({
  disabled: props.disabled,
  invalid: props.invalid,
  required: props.required,
}))

// Same as reka's `Label` (for any element it renders): block text selection on double-click. A plain element keeps
// `<Label>` from mounting a reka `Label` + `Primitive` pair per field. A user `@mousedown` falls through and runs after this.
const onMousedown = (event: MouseEvent) => {
  if (!event.defaultPrevented && event.detail > 1) event.preventDefault()
}
</script>
