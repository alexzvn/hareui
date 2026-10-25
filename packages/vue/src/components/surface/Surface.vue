<template>
  <Primitive :as="as" data-slot="surface" :class="ui.base()">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide, toRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { surfaceContextKey } from './context'
import type { SurfaceProps, SurfaceSlots } from './Surface.types'
import theme from './theme'

const props = withDefaults(defineProps<SurfaceProps>(), { as: 'div', variant: 'default' })
defineSlots<SurfaceSlots>()

const ui = useComponentUI('surface', {
  theme,
  variantProps: () => ({
    variant: props.variant,
  }),
  props,
})

const variant = computed(() => props.variant ?? 'default')
provide(surfaceContextKey, { variant: toRef(variant) })
</script>
