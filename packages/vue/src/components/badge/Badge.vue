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

<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Badge = typeof theme

export type BadgeProps = {
  /** Text or number shown in the badge, wrapped in the `label` element. Omit it (and `#content`) for a dot. */
  content?: string | number
  /** Badge color. */
  color?: ComponentVariants<Badge>['color']
  /** Corner of the anchored element the badge sits on. */
  placement?: ComponentVariants<Badge>['placement']
  /** Badge size. */
  size?: ComponentVariants<Badge>['size']
  /** Badge variant. */
  variant?: ComponentVariants<Badge>['variant']
  /** Additional classes merged into the badge element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Badge>
}

export type BadgeSlots = {
  /** The element the badge is anchored to (HeroUI's `Badge.Anchor` children). Without it the badge renders on its own. */
  default?: () => any
  /** Custom badge content such as an icon, rendered without the `label` wrapper. */
  content?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<BadgeProps>()
const slots = defineSlots<BadgeSlots>()

const ui = useComponentUI('badge', theme, () => ({
  color: props.color,
  placement: props.placement,
  size: props.size,
  variant: props.variant,
}))
</script>
