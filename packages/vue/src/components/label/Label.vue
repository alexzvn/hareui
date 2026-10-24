<template>
  <component
    :is="as"
    :for="as === 'label' ? props.for : undefined"
    data-slot="label"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @mousedown="onMousedown"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

import type { LabelProps, LabelSlots } from './Label.types'
import theme from './theme'

const props = withDefaults(defineProps<LabelProps>(), { as: 'label' })
defineSlots<LabelSlots>()

const ui = useComponentUI('label', theme, () => ({
  disabled: props.disabled,
  invalid: props.invalid,
  required: props.required,
}))

// Same as reka's `Label` (for any element it renders): block text selection on double-click. A plain element keeps
// `<Label>` from mounting a reka `Label` + `Primitive` pair per field. A user `@mousedown` falls through and runs after this.
const onMousedown = (event: MouseEvent) => {
  if (!event.defaultPrevented && event.detail > 1) event.preventDefault()
}
</script>
