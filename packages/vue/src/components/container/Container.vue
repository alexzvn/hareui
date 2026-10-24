<template>
  <Primitive
    :as="as"
    data-slot="container"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Container = typeof theme

export type ContainerProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Container>
}

export type ContainerSlots = {
  /** The container content. */
  default?: () => unknown
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<ContainerProps>(), { as: 'div' })
defineSlots<ContainerSlots>()

const ui = useComponentUI('container', theme, () => ({}))
</script>
