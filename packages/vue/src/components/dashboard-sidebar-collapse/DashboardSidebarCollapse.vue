<template>
  <Button
    :as="as"
    icon-only
    data-slot="dashboard-sidebar-collapse"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    :aria-expanded="!collapsed"
    :aria-controls="sidebar?.id.value"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="sidebar?.collapse(!collapsed)"
  >
    <slot :collapsed="collapsed">
      <svg
        v-if="side === 'left'"
        aria-hidden="true"
        fill="none"
        height="16"
        role="presentation"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M6 3.5h6A1.5 1.5 0 0 1 13.5 5v6a1.5 1.5 0 0 1-1.5 1.5H6zm-1.5 0H4A1.5 1.5 0 0 0 2.5 5v6A1.5 1.5 0 0 0 4 12.5h.5zM1 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
      <svg
        v-else
        aria-hidden="true"
        fill="none"
        height="16"
        role="presentation"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M10 3.5H4A1.5 1.5 0 0 0 2.5 5v6A1.5 1.5 0 0 0 4 12.5h6zm1.5 0h.5A1.5 1.5 0 0 1 13.5 5v6a1.5 1.5 0 0 1-1.5 1.5h-.5zM15 5a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </slot>
  </Button>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.vue'
import type { DashboardSidebarSide } from '@/composables/useDashboard'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type DashboardSidebarCollapse = typeof theme

export type DashboardSidebarCollapseProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The side of the sidebar to collapse: `left` is the main sidebar, `right` the aside panel.
   * @defaultValue 'left'
   */
  side?: DashboardSidebarSide
  /**
   * Visual style of the button.
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * Size of the button.
   * @defaultValue 'sm'
   */
  size?: ButtonProps['size']
  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardSidebarCollapse>
}

export type DashboardSidebarCollapseSlots = {
  /** The button content. Defaults to the gravity-ui `layout-side-content-left` icon (`-right` for `side="right"`). */
  default?: (props: { collapsed: boolean }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'

const props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  as: 'button',
  side: 'left',
  variant: 'ghost',
  size: 'sm',
  disabled: undefined,
})
defineSlots<DashboardSidebarCollapseSlots>()

const ui = useComponentUI('dashboardSidebarCollapse', theme, () => ({ side: props.side }))

const dashboard = useDashboard()
const sidebar = computed(() => dashboard?.sidebars[props.side])
const collapsed = computed(() => sidebar.value?.collapsed.value ?? false)
</script>
