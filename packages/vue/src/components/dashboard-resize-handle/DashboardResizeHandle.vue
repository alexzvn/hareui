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

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type DashboardResizeHandle = typeof theme

export interface DashboardResizeHandleProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardResizeHandle>
}

export interface DashboardResizeHandleSlots {
  /** Custom handle content. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<DashboardResizeHandleProps>()
defineSlots<DashboardResizeHandleSlots>()

const ui = useComponentUI('dashboardResizeHandle', theme, () => ({}))
</script>
