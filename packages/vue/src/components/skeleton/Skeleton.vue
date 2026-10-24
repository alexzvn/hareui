<template>
  <Primitive :as="as" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Skeleton = typeof theme

export type SkeletonProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Animation type. When omitted, the `--skeleton-animation` CSS variable on `:root`
   * (`shimmer`, `pulse` or `none`) decides, falling back to `shimmer`.
   */
  animationType?: ComponentVariants<Skeleton>['animationType']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Skeleton>
}

export type SkeletonSlots = {
  /** Optional content rendered inside the placeholder. */
  default?: () => any
}

// `null` = not read yet. Read once per page, like HeroUI's cached `useCSSVariable`.
let cssAnimationCache: string | undefined | null = null

const readCssAnimation = (): string | undefined => {
  if (cssAnimationCache === null)
    cssAnimationCache =
      getComputedStyle(document.documentElement).getPropertyValue('--skeleton-animation').trim() ||
      undefined
  return cssAnimationCache
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { onMounted, ref } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<SkeletonProps>(), { as: 'div' })
defineSlots<SkeletonSlots>()

// Resolved after mount so server and client render the same markup (HeroUI returns
// undefined during SSR too); the default `shimmer` matches the default variable.
const cssAnimation = ref<string>()
onMounted(() => {
  cssAnimation.value = readCssAnimation()
})

const ui = useComponentUI('skeleton', theme, () => ({
  animationType: props.animationType ?? cssAnimation.value,
}))
</script>
