<template>
  <Primitive
    :as="as.root"
    data-slot="dashboard-navbar"
    v-bind="$attrs"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <div data-slot="dashboard-navbar-left" :class="ui.left({ class: props.ui?.left })">
      <slot v-if="toggleSide === 'left'" name="toggle" v-bind="{ ...context, ui }">
        <DashboardSidebarToggle
          v-if="toggle"
          :side="toggleSide"
          v-bind="toggleProps"
          data-slot="dashboard-navbar-toggle"
          :class="toggleClass"
        />
      </slot>

      <slot name="left" v-bind="context">
        <slot name="leading" v-bind="{ ...context, ui }" />

        <Primitive
          v-if="title || slots.title"
          :as="as.title"
          data-slot="dashboard-navbar-title"
          :class="ui.title({ class: props.ui?.title })"
        >
          <slot name="title">
            <span class="truncate">{{ title }}</span>
          </slot>
        </Primitive>

        <slot name="trailing" v-bind="{ ...context, ui }" />
      </slot>
    </div>

    <div
      v-if="slots.default"
      data-slot="dashboard-navbar-center"
      :class="ui.center({ class: props.ui?.center })"
    >
      <slot v-bind="context" />
    </div>

    <div data-slot="dashboard-navbar-right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" v-bind="context" />

      <slot v-if="toggleSide === 'right'" name="toggle" v-bind="{ ...context, ui }">
        <DashboardSidebarToggle
          v-if="toggle"
          :side="toggleSide"
          v-bind="toggleProps"
          data-slot="dashboard-navbar-toggle"
          :class="toggleClass"
        />
      </slot>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import DashboardSidebarToggle from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'
import { resolveAs } from '@/utils/resolveAs'

import type {
  DashboardNavbarProps,
  DashboardNavbarSlotProps,
  DashboardNavbarSlots,
} from './DashboardNavbar.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  as: 'div',
  toggle: true,
  toggleSide: 'left',
})

const slots = defineSlots<DashboardNavbarSlots>()

const ui = useComponentUI('dashboardNavbar', {
  theme,
  variantProps: () => ({ toggleSide: props.toggleSide }),
})

const as = computed(() => resolveAs(props.as, { root: 'div', title: 'h1' }))

const dashboard = useDashboard()
const context = computed<Partial<DashboardNavbarSlotProps>>(() =>
  dashboard
    ? {
        sidebarOpen: dashboard.sidebarOpen,
        toggleSidebar: dashboard.toggleSidebar,
        sidebarCollapsed: dashboard.sidebarCollapsed,
        collapseSidebar: dashboard.collapseSidebar,
        sidebars: dashboard.sidebars,
      }
    : {},
)

// `toggle.class` goes through the `toggle` slot classes so it can override them (e.g. the optical offset).
const toggleProps = computed(() => {
  if (typeof props.toggle !== 'object') return {}
  const { class: _class, ...rest } = props.toggle

  return rest
})

const toggleClass = computed(() =>
  ui.value.toggle({
    class: [props.ui?.toggle, typeof props.toggle === 'object' ? props.toggle.class : undefined],
  }),
)
</script>
