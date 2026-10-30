<template>
  <span :id="id" data-slot="description" :class="ui.base()">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { DescriptionProps, DescriptionSlots } from './Description.types'
import theme from './theme'

const props = defineProps<DescriptionProps>()
defineSlots<DescriptionSlots>()

const ui = useComponentUI('description', { theme: theme, variantProps: () => ({}), props })
</script>
