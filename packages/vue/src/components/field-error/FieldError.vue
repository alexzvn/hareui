<template>
  <span
    :id="id"
    data-slot="field-error"
    data-visible="true"
    role="alert"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type FieldError = typeof theme

export type FieldErrorProps = {
  /** The id of the element, referenced by `aria-describedby` of the invalid control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<FieldError>
}

export type FieldErrorSlots = {
  /** The error message. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<FieldErrorProps>()
defineSlots<FieldErrorSlots>()

const ui = useComponentUI('fieldError', theme, () => ({}))
</script>
