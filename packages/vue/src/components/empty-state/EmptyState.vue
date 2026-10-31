<template>
  <div data-slot="empty-state" :class="ui.base()">
    <slot>{{ t('emptyState.label') }}</slot>
  </div>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type { EmptyStateProps, EmptyStateSlots } from './EmptyState.types'
import theme from './theme'

const { t } = useLocale()

const props = defineProps<EmptyStateProps>()
defineSlots<EmptyStateSlots>()

const ui = useComponentUI('emptyState', { theme: theme, variantProps: () => ({}), props })
</script>
