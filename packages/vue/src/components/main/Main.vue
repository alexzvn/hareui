<template>
  <Primitive :as="as" data-slot="main" :class="ui.base()">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { MainProps, MainSlots } from './Main.types'
import theme from './theme'

const props = withDefaults(defineProps<MainProps>(), { as: 'main' })
defineSlots<MainSlots>()

const ui = useComponentUI('main', { theme: theme, variantProps: () => ({}), props })
</script>
