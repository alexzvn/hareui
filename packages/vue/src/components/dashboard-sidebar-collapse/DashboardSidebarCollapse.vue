<template>
  <Button
    :as="as"
    icon-only
    data-slot="dashboard-sidebar-collapse"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :aria-label="
      collapsed ? t('dashboardSidebarCollapse.expand') : t('dashboardSidebarCollapse.collapse')
    "
    :aria-expanded="!collapsed"
    :aria-controls="sidebar?.id.value"
    :class="ui.base()"
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

<script setup lang="ts">
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'
import { useLocale } from '@/composables/useLocale'

import type {
  DashboardSidebarCollapseProps,
  DashboardSidebarCollapseSlots,
} from './DashboardSidebarCollapse.types'
import theme from './theme'

const { t } = useLocale()

const props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  as: 'button',
  side: 'left',
  variant: 'ghost',
  size: 'sm',
  disabled: undefined,
})

defineSlots<DashboardSidebarCollapseSlots>()

const ui = useComponentUI('dashboardSidebarCollapse', {
  theme,
  variantProps: () => ({ side: props.side }),
  props,
})

const dashboard = useDashboard()
const sidebar = computed(() => dashboard?.sidebars[props.side])
const collapsed = computed(() => sidebar.value?.collapsed.value ?? false)
</script>
