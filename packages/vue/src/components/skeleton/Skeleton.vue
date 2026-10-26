<template>
  <Primitive :as="as" :class="ui.base()">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { onMounted, ref } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { readCssAnimation } from './cssAnimation'
import type { SkeletonProps, SkeletonSlots } from './Skeleton.types'
import theme from './theme'

const props = withDefaults(defineProps<SkeletonProps>(), { as: 'div' })
defineSlots<SkeletonSlots>()

// Resolved after mount so server and client render the same markup (HeroUI returns
// undefined during SSR too); the default `shimmer` matches the default variable.
const cssAnimation = ref<string>()

onMounted(() => {
  cssAnimation.value = readCssAnimation()
})

const ui = useComponentUI('skeleton', {
  theme,
  variantProps: () => ({
    animationType: props.animationType ?? cssAnimation.value,
  }),
  props,
})
</script>
