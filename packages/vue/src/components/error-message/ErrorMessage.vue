<template>
  <span
    :id="id"
    slot="errorMessage"
    data-slot="error-message"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type ErrorMessage = typeof theme

export interface ErrorMessageProps {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ErrorMessage>
}

export interface ErrorMessageSlots {
  /** The error message content. The element stays rendered while empty, like HeroUI's. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '../../composables/useComponentUI'

const props = defineProps<ErrorMessageProps>()
defineSlots<ErrorMessageSlots>()

const ui = useComponentUI('errorMessage', theme, () => ({}))
</script>
