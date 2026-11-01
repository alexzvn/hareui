<template>
  <Chip
    :as="as"
    :color="color"
    :variant="variant"
    :size="size"
    :class="ui.base()"
    :ui="{ label: ui.label() }"
    :data-trend="trend"
  >
    <template #leading>
      <slot name="indicator">
        <ArrowUpIcon
          v-if="trend !== 'neutral'"
          data-slot="trend-chip-indicator"
          :class="ui.indicator()"
        />
      </slot>
    </template>
    <template v-if="!!slots.prefix"
      ><span data-slot="trend-chip-prefix" :class="ui.prefix()"><slot name="prefix" /></span
      >{{ ' ' }}</template
    ><span data-slot="trend-chip-value" :class="ui.value()"
      ><slot>{{ label }}</slot></span
    ><template v-if="!!slots.suffix"
      >{{ ' '
      }}<span data-slot="trend-chip-suffix" :class="ui.suffix()"><slot name="suffix" /></span
    ></template>
  </Chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Chip } from '@/components/chip'
import { useComponentUI } from '@/composables/useComponentUI'

import { ArrowUpIcon } from './icons'
import theme from './theme'
import type { TrendChipProps, TrendChipSlots } from './TrendChip.types'

const props = withDefaults(defineProps<TrendChipProps>(), {
  as: 'span',
  trend: 'up',
  variant: 'soft',
  size: 'sm',
})

const slots = defineSlots<TrendChipSlots>()

const TREND_COLORS = { up: 'success', down: 'danger', neutral: 'default' } as const

const color = computed(() => TREND_COLORS[props.trend])

const ui = useComponentUI('trendChip', {
  theme,
  variantProps: () => ({
    trend: props.trend,
    size: props.size,
  }),
  props,
})
</script>
