<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type Surface = typeof theme

export interface SurfaceProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The visual variant of the surface.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Surface>['variant']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Surface>
}

export interface SurfaceSlots {
  /** The surface content. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide, toRef } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { surfaceContextKey } from './context'

const props = withDefaults(defineProps<SurfaceProps>(), { as: 'div', variant: 'default' })
defineSlots<SurfaceSlots>()

const ui = useComponentUI('surface', theme, () => ({
  variant: props.variant,
}))

const variant = computed(() => props.variant ?? 'default')
provide(surfaceContextKey, { variant: toRef(variant) })
</script>

<template>
  <Primitive
    :as="as"
    data-slot="surface"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>
