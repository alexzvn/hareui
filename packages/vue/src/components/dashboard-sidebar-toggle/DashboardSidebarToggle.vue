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

<script setup lang="ts">
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'

import type {
  DashboardSidebarToggleProps,
  DashboardSidebarToggleSlots,
} from './DashboardSidebarToggle.types'
import theme from './theme'

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
