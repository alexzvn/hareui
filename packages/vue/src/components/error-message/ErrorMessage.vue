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
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type ErrorMessage = typeof theme

export type ErrorMessageProps = {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ErrorMessage>
}

export type ErrorMessageSlots = {
  /** The error message content. The element stays rendered while empty, like HeroUI's. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<ErrorMessageProps>()
defineSlots<ErrorMessageSlots>()

const ui = useComponentUI('errorMessage', theme, () => ({}))
</script>
