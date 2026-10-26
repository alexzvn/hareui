<template>
  <span :id="id" slot="errorMessage" data-slot="error-message" :class="ui.base()">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { ErrorMessageProps, ErrorMessageSlots } from './ErrorMessage.types'
import theme from './theme'

const props = defineProps<ErrorMessageProps>()
defineSlots<ErrorMessageSlots>()

const ui = useComponentUI('errorMessage', { theme: theme, variantProps: () => ({}), props })
</script>
