<template>
  <Primitive
    :as="as"
    data-slot="metric-group"
    :data-stacked="stacked || undefined"
    :class="ui.base()"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { MetricGroupProps, MetricGroupSlots } from './MetricGroup.types'
import theme from './theme'

const props = withDefaults(defineProps<MetricGroupProps>(), {
  as: 'div',
  stacked: false,
})

defineSlots<MetricGroupSlots>()

const ui = useComponentUI('metricGroup', {
  theme,
  variantProps: () => ({ stacked: props.stacked }),
  props,
})
</script>
