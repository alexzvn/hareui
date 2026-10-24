<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { DashboardSidebarSide } from '../../composables/useDashboard'
import type { ComponentSlots } from '../../types/tv'
import type { ClassValue } from '../../utils/tv'
import type { ButtonProps } from '../button/Button.vue'
import theme from './theme'

type DashboardSidebarToggle = typeof theme

export interface DashboardSidebarToggleProps {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The side of the sidebar to toggle: `left` is the main sidebar, `right` the aside panel.
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
  ui?: ComponentSlots<DashboardSidebarToggle>
}

export interface DashboardSidebarToggleSlots {
  /** The button content. Defaults to the gravity-ui `bars` icon, and to a close icon while the sidebar is open. */
  default?: (props: { open: boolean }) => unknown
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useDashboard } from '../../composables/useDashboard'
import Button from '../button/Button.vue'

const props = withDefaults(defineProps<DashboardSidebarToggleProps>(), {
  as: 'button',
  side: 'left',
  variant: 'ghost',
  size: 'sm',
  disabled: undefined,
})
defineSlots<DashboardSidebarToggleSlots>()

const ui = useComponentUI('dashboardSidebarToggle', theme, () => ({ side: props.side }))

const dashboard = useDashboard()
const sidebar = computed(() => dashboard?.sidebars[props.side])
const open = computed(() => sidebar.value?.open.value ?? false)
</script>

<template>
  <Button
    :as="as"
    icon-only
    data-slot="dashboard-sidebar-toggle"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :aria-label="open ? 'Close sidebar' : 'Open sidebar'"
    :aria-expanded="open"
    :aria-controls="open && sidebar?.id.value ? `${sidebar.id.value}-menu` : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="sidebar?.toggle()"
  >
    <slot :open="open">
      <svg
        v-if="open"
        aria-hidden="true"
        fill="none"
        height="16"
        role="presentation"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4l8 8M12 4l-8 8" />
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
          d="M1.25 3.25A.75.75 0 0 1 2 2.5h12A.75.75 0 0 1 14 4H2a.75.75 0 0 1-.75-.75m0 4.75A.75.75 0 0 1 2 7.25h12a.75.75 0 0 1 0 1.5H2A.75.75 0 0 1 1.25 8M2 12a.75.75 0 0 0 0 1.5h12a.75.75 0 0 0 0-1.5z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </slot>
  </Button>
</template>
