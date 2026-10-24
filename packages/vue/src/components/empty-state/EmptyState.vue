<template>
  <div data-slot="empty-state" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot>No results found</slot>
  </div>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { EmptyStateProps, EmptyStateSlots } from './EmptyState.types'
import theme from './theme'

const props = defineProps<EmptyStateProps>()
defineSlots<EmptyStateSlots>()

const ui = useComponentUI('emptyState', { theme: theme, variantProps: () => ({}) })
</script>
