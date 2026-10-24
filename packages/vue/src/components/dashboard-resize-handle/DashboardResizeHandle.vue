<template>
  <Primitive
    :as="as"
    role="separator"
    data-slot="dashboard-resize-handle"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  DashboardResizeHandleProps,
  DashboardResizeHandleSlots,
} from './DashboardResizeHandle.types'
import theme from './theme'

const props = defineProps<DashboardResizeHandleProps>()
defineSlots<DashboardResizeHandleSlots>()

const ui = useComponentUI('dashboardResizeHandle', { theme: theme, variantProps: () => ({}) })
</script>
