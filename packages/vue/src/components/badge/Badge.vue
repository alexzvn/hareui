<template>
  <span
    v-if="slots.default"
    data-slot="badge-anchor"
    :class="ui.anchor({ class: props.ui?.anchor })"
  >
    <slot />
    <span data-slot="badge" :class="ui.base({ class: [props.ui?.base, props.class] })">
      <slot name="content">
        <span
          v-if="content !== undefined && content !== ''"
          data-slot="badge-label"
          :class="ui.label({ class: props.ui?.label })"
          >{{ content }}</span
        >
      </slot>
    </span>
  </span>
  <span v-else data-slot="badge" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot name="content">
      <span
        v-if="content !== undefined && content !== ''"
        data-slot="badge-label"
        :class="ui.label({ class: props.ui?.label })"
        >{{ content }}</span
      >
    </slot>
  </span>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { BadgeProps, BadgeSlots } from './Badge.types'
import theme from './theme'

const props = defineProps<BadgeProps>()
const slots = defineSlots<BadgeSlots>()

const ui = useComponentUI('badge', theme, () => ({
  color: props.color,
  placement: props.placement,
  size: props.size,
  variant: props.variant,
}))
</script>
