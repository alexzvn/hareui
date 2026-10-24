<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '../../types/tv'
import type { ClassValue } from '../../utils/tv'
import theme from './theme'

type DashboardToolbar = typeof theme

export interface DashboardToolbarProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardToolbar>
}

export interface DashboardToolbarSlots {
  /** Replaces the `left` and `right` groups. */
  default?: () => unknown
  /** Content aligned to the start. */
  left?: () => unknown
  /** Content aligned to the end. */
  right?: () => unknown
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '../../composables/useComponentUI'

const props = withDefaults(defineProps<DashboardToolbarProps>(), { as: 'div' })
defineSlots<DashboardToolbarSlots>()

const ui = useComponentUI('dashboardToolbar', theme, () => ({}))
</script>

<template>
  <Primitive
    :as="as"
    data-slot="dashboard-toolbar"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot>
      <div data-slot="dashboard-toolbar-left" :class="ui.left({ class: props.ui?.left })">
        <slot name="left" />
      </div>
      <div data-slot="dashboard-toolbar-right" :class="ui.right({ class: props.ui?.right })">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>
