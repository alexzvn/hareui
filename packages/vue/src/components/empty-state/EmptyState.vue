<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type EmptyState = typeof theme

export interface EmptyStateProps {
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EmptyState>
}

export interface EmptyStateSlots {
  /** The empty-state content. Defaults to "No results found". */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '../../composables/useComponentUI'

const props = defineProps<EmptyStateProps>()
defineSlots<EmptyStateSlots>()

const ui = useComponentUI('emptyState', theme, () => ({}))
</script>

<template>
  <div data-slot="empty-state" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot>No results found</slot>
  </div>
</template>
