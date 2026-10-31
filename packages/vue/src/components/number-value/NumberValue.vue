<template>
  <span data-slot="number-value" :class="ui.base()">
    <span v-if="$slots.prefix" data-slot="number-value-prefix" :class="ui.prefix()">
      <slot name="prefix" />
    </span>
    <span data-slot="number-value-value" :class="ui.value()">
      <slot :formatted="formatted" :value="value">{{ formatted }}</slot>
    </span>
    <span v-if="$slots.suffix" data-slot="number-value-suffix" :class="ui.suffix()">
      <slot name="suffix" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { useLocale } from 'reka-ui'
import { computed, toRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { createNumberFormatter } from '@/utils/numberFormatter'

import type { NumberValueProps, NumberValueSlots } from './NumberValue.types'
import theme from './theme'

const props = withDefaults(defineProps<NumberValueProps>(), { format: 'decimal' })
defineSlots<NumberValueSlots>()

const ui = useComponentUI('numberValue', { theme: theme, variantProps: () => ({}), props })

const locale = useLocale(toRef(() => props.locale))
const formatNumber = createNumberFormatter()

const formatted = computed(() => {
  const options: Intl.NumberFormatOptions = {
    style: props.format,
    currency: props.currency,
    unit: props.unit,
    notation: props.notation,
    signDisplay: props.signDisplay,
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits,
    ...props.options,
  }

  return formatNumber(props.value, { locale: locale.value, options })
})
</script>
