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

<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'reka-ui'
import { computed, inject } from 'vue'

import { toolbarContextKey } from '@/components/toolbar/context'
import { useComponentUI } from '@/composables/useComponentUI'

import type { SeparatorProps, SeparatorSlots } from './Separator.types'
import theme from './theme'

const props = defineProps<SeparatorProps>()
defineSlots<SeparatorSlots>()

// Inside a Toolbar the separator defaults to the orientation perpendicular to the toolbar
const toolbar = inject(toolbarContextKey, null)
const resolvedOrientation = computed(() => {
  if (!toolbar) return props.orientation ?? 'horizontal'

  const perpendicular = toolbar.orientation.value === 'horizontal' ? 'vertical' : 'horizontal'

  return props.orientation ?? perpendicular
})

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
