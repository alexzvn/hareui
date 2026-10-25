<template>
  <Primitive
    :as="as"
    data-slot="disclosure-group"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base()"
  >
    <slot :expanded="expanded" :disabled="!!disabled" />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useExpandedValues } from '@/composables/useExpandedValues'

import { disclosureGroupContextKey } from './context'
import type {
  DisclosureGroupProps,
  DisclosureGroupSlots,
  DisclosureGroupEmits,
} from './DisclosureGroup.types'
import theme from './theme'

// `modelValue: undefined` keeps the uncontrolled mode when no `v-model` is bound.
const props = withDefaults(defineProps<DisclosureGroupProps>(), {
  as: 'div',
  modelValue: undefined,
})

const emit = defineEmits<DisclosureGroupEmits>()
defineSlots<DisclosureGroupSlots>()

const ui = useComponentUI('disclosureGroup', { theme: theme, variantProps: () => ({}), props })

const { expanded, isExpanded, setExpanded } = useExpandedValues(props, (value) =>
  emit('update:modelValue', value),
)

provide(disclosureGroupContextKey, {
  isExpanded,
  setExpanded,
  disabled: computed(() => !!props.disabled),
})
</script>
