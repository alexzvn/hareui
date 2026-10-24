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

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { FieldErrorProps, FieldErrorSlots } from './FieldError.types'
import theme from './theme'

const props = defineProps<FieldErrorProps>()
defineSlots<FieldErrorSlots>()

const ui = useComponentUI('fieldError', { theme: theme, variantProps: () => ({}) })
</script>
