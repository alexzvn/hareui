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

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { DashboardSidebarToggleProps } from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import type { DashboardContext, DashboardSidebarSide } from '@/composables/useDashboard'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type DashboardNavbar = typeof theme

export type DashboardNavbarProps = {
  /**
   * The element or component to render as. An object sets the element per part (`{ root, title }`).
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as'] | { root?: PrimitiveProps['as']; title?: PrimitiveProps['as'] }
  /** The title displayed in the left group. */
  title?: string
  /**
   * The button that opens the sidebar on mobile (a `DashboardSidebarToggle`). An object is forwarded to it; `false` hides it.
   * @defaultValue true
   */
  toggle?: boolean | DashboardSidebarToggleProps
  /**
   * The side of the navbar to render the toggle button on. It also selects the sidebar it controls (`left` or `right`) unless `toggle.side` is set.
   * @defaultValue 'left'
   */
  toggleSide?: DashboardSidebarSide
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardNavbar>
}

/** The dashboard state handed to the navbar slots (the group's configuration is left out). */
export type DashboardNavbarSlotProps = Pick<
  DashboardContext,
  'sidebarOpen' | 'toggleSidebar' | 'sidebarCollapsed' | 'collapseSidebar' | 'sidebars'
>

export type DashboardNavbarSlots = {
  /** Replaces the `leading`, `title` and `trailing` content of the left group. */
  left?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Content before the title, e.g. an icon or a logo. */
  leading?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
  /** The title. Defaults to the `title` prop. */
  title?: () => unknown
  /** Content after the title. */
  trailing?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
  /** Centered content, shown from the `lg` breakpoint. */
  default?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Content aligned to the end. */
  right?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Replaces the sidebar toggle button. */
  toggle?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import DashboardSidebarToggle from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDashboard } from '@/composables/useDashboard'
import { resolveAs } from '@/utils/resolveAs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  as: 'div',
  toggle: true,
  toggleSide: 'left',
})

const slots = defineSlots<DashboardNavbarSlots>()

const ui = useComponentUI('dashboardNavbar', theme, () => ({ toggleSide: props.toggleSide }))

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
