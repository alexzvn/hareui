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

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Separator = typeof theme

export type SeparatorProps = {
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
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Separator>
}

export type SeparatorSlots = {
  /** Content rendered inside the separator (uncommon; HeroUI's separator is normally empty). */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'reka-ui'
import { computed, inject } from 'vue'

import { toolbarContextKey } from '@/components/toolbar/context'
import { useComponentUI } from '@/composables/useComponentUI'

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
