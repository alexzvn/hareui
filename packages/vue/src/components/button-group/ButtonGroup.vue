<template>
  <Primitive
    ref="root"
    :as="as"
    role="group"
    data-slot="button-group"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [toolbarClass, props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject, provide, toRef, useTemplateRef } from 'vue'

import { toolbarContextKey } from '@/components/toolbar/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFirstChild } from '@/composables/useFirstChild'

import type { ButtonGroupProps, ButtonGroupSlots } from './ButtonGroup.types'
import { buttonGroupContextKey } from './context'
import theme from './theme'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  as: 'div',
  disabled: undefined,
  fullWidth: undefined,
})

defineSlots<ButtonGroupSlots>()

// Inside a Toolbar the group takes the toolbar's orientation (HeroUI reads React Aria's ToggleButtonGroupContext).
const toolbar = inject(toolbarContextKey, null)
const orientation = computed(() => props.orientation ?? toolbar?.orientation.value ?? 'horizontal')

const ui = useComponentUI('buttonGroup', theme, () => ({
  orientation: orientation.value,
  fullWidth: props.fullWidth,
}))

const toolbarClass = computed(() =>
  toolbar?.ui.value.buttonGroup({ class: toolbar.uiOverrides.value?.buttonGroup }),
)

const firstChild = useFirstChild(useTemplateRef('root'))

provide(buttonGroupContextKey, {
  variant: toRef(() => props.variant),
  size: toRef(() => props.size),
  disabled: toRef(() => props.disabled),
  fullWidth: toRef(() => props.fullWidth),
  separator: toRef(() => props.separator),
  firstChild,
  ui,
  uiOverrides: toRef(() => props.ui),
})
</script>
