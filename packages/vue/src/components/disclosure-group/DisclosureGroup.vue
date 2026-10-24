<template>
  <Primitive
    :as="as"
    data-slot="disclosure-group"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot :expanded="expanded" :disabled="!!disabled" />
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ExpandedValue } from '@/composables/useExpandedValues'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type DisclosureGroup = typeof theme

export type DisclosureGroupProps = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The expanded disclosures' `value`s. Use `v-model` to control them. */
  modelValue?: ExpandedValue[]
  /** The disclosures expanded on first render (uncontrolled). */
  defaultValue?: ExpandedValue[]
  /**
   * Whether multiple disclosures can be expanded at once (HeroUI's `allowsMultipleExpanded`).
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * Whether all disclosures in the group are disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DisclosureGroup>
}

export type DisclosureGroupSlots = {
  /** The `Disclosure` items (and anything between them, e.g. `Separator`). */
  default?: (props: { expanded: ExpandedValue[]; disabled: boolean }) => VNode[]
}

export type DisclosureGroupEmits = {
  /** Emitted when the expanded disclosures change. */
  'update:modelValue': [value: ExpandedValue[]]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, provide } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useExpandedValues } from '@/composables/useExpandedValues'

import { disclosureGroupContextKey } from './context'

// `modelValue: undefined` keeps the uncontrolled mode when no `v-model` is bound.
const props = withDefaults(defineProps<DisclosureGroupProps>(), {
  as: 'div',
  modelValue: undefined,
})

const emit = defineEmits<DisclosureGroupEmits>()
defineSlots<DisclosureGroupSlots>()

const ui = useComponentUI('disclosureGroup', theme, () => ({}))

const { expanded, isExpanded, setExpanded } = useExpandedValues(props, (value) =>
  emit('update:modelValue', value),
)

provide(disclosureGroupContextKey, {
  isExpanded,
  setExpanded,
  disabled: computed(() => !!props.disabled),
})
</script>
