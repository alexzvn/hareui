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
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type DashboardResizeHandle = typeof theme

export type DashboardResizeHandleProps = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardResizeHandle>
}

export type DashboardResizeHandleSlots = {
  /** Custom handle content. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<DashboardResizeHandleProps>()
defineSlots<DashboardResizeHandleSlots>()

const ui = useComponentUI('dashboardResizeHandle', theme, () => ({}))
</script>
