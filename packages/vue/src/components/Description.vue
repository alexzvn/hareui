<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/description'

type Description = typeof theme

export interface DescriptionProps {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Description>
}

export interface DescriptionSlots {
  /** The description content. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '../composables/useComponentUI'

const props = defineProps<DescriptionProps>()
defineSlots<DescriptionSlots>()

const ui = useComponentUI('description', theme, () => ({}))
</script>

<template>
  <span :id="id" data-slot="description" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </span>
</template>
