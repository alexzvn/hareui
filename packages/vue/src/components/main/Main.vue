<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '../../types/tv'
import type { ClassValue } from '../../utils/tv'
import theme from './theme'

type Main = typeof theme

export interface MainProps {
  /**
   * The element or component to render as.
   * @defaultValue 'main'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Main>
}

export interface MainSlots {
  /** The page content. */
  default?: () => unknown
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '../../composables/useComponentUI'

const props = withDefaults(defineProps<MainProps>(), { as: 'main' })
defineSlots<MainSlots>()

const ui = useComponentUI('main', theme, () => ({}))
</script>

<template>
  <Primitive :as="as" data-slot="main" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
