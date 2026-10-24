<template>
  <Primitive
    :as="as"
    data-slot="container"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { ContainerProps, ContainerSlots } from './Container.types'
import theme from './theme'

const props = withDefaults(defineProps<ContainerProps>(), { as: 'div' })
defineSlots<ContainerSlots>()

const ui = useComponentUI('container', { theme: theme, variantProps: () => ({}) })
</script>
