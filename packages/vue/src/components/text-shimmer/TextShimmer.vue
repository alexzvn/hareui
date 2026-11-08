<template>
  <Primitive
    :as="as"
    data-slot="text-shimmer"
    :class="ui.base()"
    :style="{
      '--text-shimmer-duration': `${duration}s`,
      '--text-shimmer-spread': `${spread}ch`,
    }"
  >
    <span :id="textId" data-slot="text-shimmer-text" :class="ui.text()">
      <slot>{{ text }}</slot>
    </span>
    <span
      aria-hidden="true"
      data-slot="text-shimmer-highlight"
      :class="ui.highlight()"
      :style="{ '--text-shimmer-mask': `-moz-element(#${textId})` }"
    >
      <slot>{{ text }}</slot>
    </span>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useId } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { TextShimmerProps, TextShimmerSlots } from './TextShimmer.types'
import theme from './theme'

const props = withDefaults(defineProps<TextShimmerProps>(), {
  as: 'span',
  duration: 2.5,
  spread: 4,
})

defineSlots<TextShimmerSlots>()

// The element mask (browsers without `mask-clip: text`) points at the visible copy by id.
const textId = useId()

const ui = useComponentUI('textShimmer', { theme, variantProps: () => ({}), props })
</script>
