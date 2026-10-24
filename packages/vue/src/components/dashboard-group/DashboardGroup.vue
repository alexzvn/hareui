<template>
  <Primitive
    :as="as"
    data-slot="dashboard-group"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { DashboardStorage, DashboardUnit } from '@/composables/useDashboard'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type DashboardGroup = typeof theme

export interface DashboardGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Where the sidebars and panels of the group persist their size and collapsed state: a cookie (read synchronously at setup, so the first render is already correct), `localStorage`, or a custom `{ getItem, setItem }` adapter (e.g. one backed by the request cookies during SSR).
   * @defaultValue 'cookie'
   */
  storage?: DashboardStorage
  /**
   * Prefix of the storage keys. Each sidebar/panel is stored under `${storageKey}-sidebar-${id}` / `${storageKey}-panel-${id}`.
   * @defaultValue 'dashboard'
   */
  storageKey?: string
  /**
   * Whether sizes and collapsed state are written to (and read from) the storage.
   * @defaultValue true
   */
  persistent?: boolean
  /**
   * The unit of every `minSize`, `maxSize`, `defaultSize` and `collapsedSize` inside the group.
   * @defaultValue '%'
   */
  unit?: DashboardUnit
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardGroup>
}

export interface DashboardGroupSlots {
  /** The sidebars and panels. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'
import { createDashboardSidebarState, provideDashboardContext } from '@/composables/useDashboard'

const props = withDefaults(defineProps<DashboardGroupProps>(), {
  storage: 'cookie',
  storageKey: 'dashboard',
  persistent: true,
  unit: '%',
})
defineSlots<DashboardGroupSlots>()

const ui = useComponentUI('dashboardGroup', theme, () => ({}))

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
