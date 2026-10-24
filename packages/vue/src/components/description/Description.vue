<template>
  <span :id="id" data-slot="description" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </span>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Description = typeof theme

export type DescriptionProps = {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Description>
}

export type DescriptionSlots = {
  /** The description content. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useComponentUI } from '@/composables/useComponentUI'

const props = defineProps<DescriptionProps>()
defineSlots<DescriptionSlots>()

const ui = useComponentUI('description', theme, () => ({}))
</script>
