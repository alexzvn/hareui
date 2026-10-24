<template>
  <Select
    data-slot="inline-select"
    v-bind="selectProps"
    :model-value="modelValue"
    :ui="selectUi"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @load-more="emit('loadMore')"
  >
    <template #indicator="state">
      <slot name="indicator" v-bind="state">
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          role="presentation"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            d="M3.58 4.109a.75.75 0 0 0 1.061 1.06L8 1.811l3.354 3.353a.75.75 0 0 0 1.06-1.06L8.53.22a.75.75 0 0 0-1.06 0zm8.84 7.782a.75.75 0 1 0-1.061-1.06l-3.36 3.358-3.353-3.353a.75.75 0 1 0-1.06 1.06L7.47 15.78a.75.75 0 0 0 1.06 0z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </slot>
    </template>
    <template v-for="name in forwarded" #[name]="state">
      <slot :name="name" v-bind="forwardProps(state)" />
    </template>
  </Select>
</template>

<script lang="ts">
import type { ListBoxItem } from '@/components/list-box/ListBox.vue'
import type {
  SelectEmits,
  SelectProps,
  SelectSlots,
  SelectValue,
} from '@/components/select/Select.vue'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type InlineSelect = typeof theme

export type InlineSelectProps<T extends ListBoxItem = ListBoxItem> = {
  /** The selected value(s). Use with `v-model`. */
  modelValue?: SelectValue
  /**
   * Side of the trigger the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the trigger.
   * @defaultValue 'end'
   */
  align?: 'start' | 'center' | 'end'
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InlineSelect>
} & Omit<SelectProps<T>, 'variant' | 'fullWidth' | 'clearable' | 'side' | 'align' | 'ui'>

export type InlineSelectSlots<T extends ListBoxItem = ListBoxItem> = Omit<SelectSlots<T>, 'clear'>

export type InlineSelectEmits = {
  /** The selection changed (`v-model`). */
  'update:modelValue': [value: SelectValue]
} & Omit<SelectEmits, 'clear'>
</script>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import { computed } from 'vue'

import Select from '@/components/select/Select.vue'
import { useComponentUI } from '@/composables/useComponentUI'

// Absent booleans stay `undefined` so the wrapped Select keeps its own uncontrolled / validation defaults
const props = withDefaults(defineProps<InlineSelectProps<T>>(), {
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  invalid: undefined,
  loading: undefined,
  portal: undefined,
  side: 'bottom',
  align: 'end',
})

const emit = defineEmits<InlineSelectEmits>()
const slots = defineSlots<InlineSelectSlots<T>>()

const ui = useComponentUI('inlineSelect', theme, () => ({}))

const selectProps = computed(() => {
  const { ui: _ui, modelValue: _modelValue, ...rest } = props
  return rest
})

const selectUi = computed(() => ({
  base: ui.value.base({ class: props.ui?.base }),
  trigger: ui.value.trigger({ class: props.ui?.trigger }),
  value: ui.value.value({ class: props.ui?.value }),
  indicator: ui.value.indicator({ class: props.ui?.indicator }),
  popover: ui.value.popover({ class: props.ui?.popover }),
}))

// Every Select slot passes through, except `indicator` (defaulted here)
const forwarded = computed(() =>
  (Object.keys(slots) as (keyof InlineSelectSlots<T>)[]).filter((name) => name !== 'indicator'),
)

type UnionToIntersection<U> = (U extends unknown ? (u: U) => void : never) extends (
  i: infer I,
) => void
  ? I
  : never

// With a dynamic `#[name]`, TS types the received props as the union over every slot and the forwarded ones as their
// intersection; at runtime each slot gets back exactly the props Select passed to it
type ForwardedSlotProps = UnionToIntersection<
  Exclude<Parameters<NonNullable<InlineSelectSlots<T>[keyof InlineSelectSlots<T>]>>[0], undefined>
>

const forwardProps = (state: unknown) => state as ForwardedSlotProps
</script>
