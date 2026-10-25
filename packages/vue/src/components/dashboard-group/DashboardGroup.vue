<template>
  <Primitive :as="as" data-slot="dashboard-group" :class="ui.base()">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'
import { createDashboardSidebarState, provideDashboardContext } from '@/composables/useDashboard'

import type { DashboardGroupProps, DashboardGroupSlots } from './DashboardGroup.types'
import theme from './theme'

const props = withDefaults(defineProps<DashboardGroupProps>(), {
  storage: 'cookie',
  storageKey: 'dashboard',
  persistent: true,
  unit: '%',
})

defineSlots<DashboardGroupSlots>()

const ui = useComponentUI('dashboardGroup', { theme: theme, variantProps: () => ({}), props })

const left = createDashboardSidebarState()
const right = createDashboardSidebarState()

// Getters keep the context live when the group's props change.
provideDashboardContext({
  get storage() {
    return props.storage
  },
  get storageKey() {
    return props.storageKey
  },
  get persistent() {
    return props.persistent
  },
  get unit() {
    return props.unit
  },
  sidebarOpen: left.open,
  toggleSidebar: left.toggle,
  sidebarCollapsed: left.collapsed,
  collapseSidebar: left.collapse,
  sidebars: { left, right },
})
</script>
