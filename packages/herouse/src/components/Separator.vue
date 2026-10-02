<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/separator'

type Separator = typeof theme

export interface SeparatorProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The orientation of the separator.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Separator>['orientation']
  /**
   * The visual variant of the separator.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Separator>['variant']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Separator>
}

export interface SeparatorSlots {
  /** Content rendered inside the separator (uncommon; HeroUI's separator is normally empty). */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'reka-ui'
import { computed } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'

const props = withDefaults(defineProps<SeparatorProps>(), { orientation: 'horizontal' })
defineSlots<SeparatorSlots>()

const ui = useComponentUI('separator', theme, () => ({
  orientation: props.orientation,
  variant: props.variant,
}))

const resolvedOrientation = computed(() => props.orientation ?? 'horizontal')
</script>

<template>
  <SeparatorPrimitive
    :as="as"
    :orientation="resolvedOrientation"
    data-slot="separator"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </SeparatorPrimitive>
</template>
