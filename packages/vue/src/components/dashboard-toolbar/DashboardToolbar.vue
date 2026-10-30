<template>
  <Primitive :as="as" data-slot="dashboard-toolbar" :class="ui.root()">
    <slot>
      <div data-slot="dashboard-toolbar-left" :class="ui.left()">
        <slot name="left" />
      </div>
      <div data-slot="dashboard-toolbar-right" :class="ui.right()">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { DashboardToolbarProps, DashboardToolbarSlots } from './DashboardToolbar.types'
import theme from './theme'

const props = withDefaults(defineProps<DashboardToolbarProps>(), { as: 'div' })
defineSlots<DashboardToolbarSlots>()

const ui = useComponentUI('dashboardToolbar', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'root',
})
</script>
