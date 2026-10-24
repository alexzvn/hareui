<template>
  <div data-slot="switch-group" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div data-slot="switch-group-items" :class="ui.items({ class: props.ui?.items })">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { SwitchGroupProps, SwitchGroupSlots } from './SwitchGroup.types'
import theme from './theme'

const props = defineProps<SwitchGroupProps>()
defineSlots<SwitchGroupSlots>()

const ui = useComponentUI('switchGroup', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
  }),
})
</script>
