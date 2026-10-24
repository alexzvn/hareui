<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type Separator = typeof theme

export interface SeparatorProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The orientation of the separator. Inside a Toolbar it defaults to the one perpendicular to the toolbar.
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
import { computed, inject } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { toolbarContextKey } from '../toolbar/context'

const props = defineProps<SeparatorProps>()
defineSlots<SeparatorSlots>()

const toolbar = inject(toolbarContextKey, null)
const resolvedOrientation = computed(
  () =>
    props.orientation ??
    (toolbar
      ? toolbar.orientation.value === 'horizontal'
        ? 'vertical'
        : 'horizontal'
      : 'horizontal'),
)

const ui = useComponentUI('separator', theme, () => ({
  orientation: resolvedOrientation.value,
  variant: props.variant,
}))

const toolbarClass = computed(() => {
  if (!toolbar) return undefined
  const slot =
    resolvedOrientation.value === 'vertical' ? 'separatorVertical' : 'separatorHorizontal'
  return toolbar.ui.value[slot]({ class: toolbar.uiOverrides.value?.[slot] })
})
</script>

<template>
  <SeparatorPrimitive
    :as="as"
    :orientation="resolvedOrientation"
    data-slot="separator"
    :class="ui.base({ class: [toolbarClass, props.ui?.base, props.class] })"
  >
    <slot />
  </SeparatorPrimitive>
</template>
