<template>
  <Primitive v-if="prose" :as="as ?? 'div'" data-slot="prose" :class="ui.prose()">
    <slot />
  </Primitive>
  <Primitive v-else :as="element" data-slot="typography" :data-type="type" :class="ui.base()">
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import theme from './theme'
import type { TypographyProps, TypographySlots } from './Typography.types'
import { defaultElementByType } from './typography.utils'

const props = withDefaults(defineProps<TypographyProps>(), {
  type: 'body',
  align: 'start',
  color: 'default',
  truncate: false,
  prose: false,
})

defineSlots<TypographySlots>()

const ui = useComponentUI('typography', {
  theme,
  variantProps: () => ({
    type: props.type,
    align: props.align,
    color: props.color,
    weight: props.weight,
    truncate: props.truncate,
  }),
  props,
  classSlot: () => (props.prose ? 'prose' : 'base'),
})

const element = computed(() => props.as ?? defaultElementByType[props.type ?? 'body'])
</script>
