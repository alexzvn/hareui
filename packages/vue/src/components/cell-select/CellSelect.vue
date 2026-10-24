<template>
  <Select
    v-bind="selectProps"
    data-slot="cell-select"
    :model-value="modelValue"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :class="props.class"
    :ui="selectUi"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @clear="emit('clear')"
    @load-more="emit('loadMore')"
  >
    <template #leading>
      <span
        v-if="hasLabel"
        :id="labelId"
        data-slot="cell-select-label"
        :class="ui.label({ class: props.ui?.label })"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </span>
    </template>
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
            d="M3.58 4.109a.75.75 0 0 0 1.061 1.06L8 1.811l3.354 3.353a.75.75 0 0 0 1.06-1.06L8.53.22a.75.75 0 0 0-1.06 0zm8.84 7.782a.75.75 0 1 0-1.061-1.06l-3.36 3.358l-3.353-3.353a.75.75 0 1 0-1.06 1.06L7.47 15.78a.75.75 0 0 0 1.06 0z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </slot>
    </template>
    <template v-for="name in forwarded" #[name]="state">
      <slot :name="name" v-bind="state as any" />
    </template>
  </Select>
</template>

<script setup lang="ts" generic="T extends ListBoxItem = ListBoxItem">
import { computed, useId } from 'vue'

import type { ListBoxItem } from '@/components/list-box/ListBox.vue'
import Select from '@/components/select/Select.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { CellSelectProps, CellSelectSlots, CellSelectEmits } from './CellSelect.types'
import theme from './theme'

// Absent booleans stay `undefined` so the wrapped Select keeps its own uncontrolled / validation defaults
const props = withDefaults(defineProps<CellSelectProps<T>>(), {
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  invalid: undefined,
  loading: undefined,
  portal: undefined,
  variant: 'default',
  side: 'bottom',
  align: 'end',
})

const emit = defineEmits<CellSelectEmits>()
const slots = defineSlots<CellSelectSlots<T>>()

const ui = useComponentUI('cellSelect', theme, () => ({ variant: props.variant }))

const selectProps = computed(() => {
  const {
    label: _label,
    variant: _variant,
    ui: _ui,
    class: _class,
    modelValue: _modelValue,
    ...rest
  } = props

  return rest
})

const selectUi = computed(() => ({
  base: ui.value.base({ class: props.ui?.base }),
  trigger: ui.value.trigger({ class: props.ui?.trigger }),
  value: ui.value.value({ class: props.ui?.value }),
  indicator: ui.value.indicator({ class: props.ui?.indicator }),
  popover: ui.value.popover({ class: props.ui?.popover }),
}))

const labelId = `${useId()}-label`
const hasLabel = computed(() => !!(props.label || slots.label))

// Every Select slot passes through, except `label` (rendered in the row) and `indicator` (defaulted here)
const forwarded = computed(() =>
  (Object.keys(slots) as (keyof CellSelectSlots<T>)[]).filter(
    (name) => name !== 'label' && name !== 'indicator',
  ),
)
</script>
