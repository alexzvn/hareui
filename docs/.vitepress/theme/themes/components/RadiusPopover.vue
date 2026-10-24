<script setup lang="ts">
import { InputGroup, ListBox, Popover } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { useVariableSetter } from '../composables/variables'
// Port of HeroUI docs `themes/components/radius-popover.tsx`.
import type { RadiusId, ThemeVariables } from '../constants'
import ControlsPopoverTrigger from './ControlsPopoverTrigger.vue'
import LockableLabel from './LockableLabel.vue'

const props = defineProps<{
  label: string
  variableKey: keyof Pick<ThemeVariables, 'radius' | 'formRadius'>
  description?: string
  radiusOptions: Array<{
    cssValue: string
    description: string
    id: RadiusId
    label: string
  }>
}>()

const RADIUS_OPTION_LABELS: Record<RadiusId, string> = {
  'extra-large': 'extra large',
  'extra-small': 'extra small',
  large: 'large',
  medium: 'medium',
  none: 'none',
  small: 'small',
}

const { setVariable, variables } = useVariableSetter()
const currentValue = computed(() => variables.value[props.variableKey])
const currentOption = computed(() => props.radiusOptions.find((r) => r.id === currentValue.value))

const items = computed(() =>
  props.radiusOptions.map((option) => ({
    value: option.id,
    label: option.label,
    textValue: option.id,
    class:
      'group border-separator-on-surface flex h-[83px] w-[88px] flex-col items-center justify-center gap-[5px] rounded-2xl border data-[selected=true]:border-foreground',
  })),
)

function onSelectionChange(selected: unknown) {
  // `disallowEmptySelection`: clicking the selected item keeps it selected
  if (selected) setVariable(props.variableKey, String(selected) as RadiusId)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <LockableLabel :label="label" :variable="variableKey" />
    <Popover side="top" class="w-[304px] rounded-3xl" :ui="{ dialog: 'p-3' }">
      <ControlsPopoverTrigger>
        <InputGroup
          class="w-40 cursor-pointer"
          :id="variableKey"
          :name="variableKey"
          readonly
          :model-value="currentOption ? RADIUS_OPTION_LABELS[currentOption.id] : ''"
          :ui="{ prefix: 'w-10', input: 'max-w-20 cursor-pointer capitalize', suffix: 'w-10' }"
        >
          <template #prefix>
            <span class="text-base font-semibold text-muted">{{ currentOption?.label }}</span>
          </template>
          <template #suffix>
            <Icon icon="gravity-ui:chevrons-expand-vertical" class="size-3" />
          </template>
        </InputGroup>
      </ControlsPopoverTrigger>
      <template #content>
        <div class="mb-2 flex flex-col gap-0.5 ps-2">
          <p class="text-xs font-medium capitalize">{{ label }}</p>
          <p class="text-xs text-muted">{{ description }}</p>
        </div>
        <ListBox
          :aria-label="label"
          class="grid grid-cols-3 gap-2 px-0"
          :items="items"
          :model-value="currentValue"
          selection-mode="single"
          @update:model-value="onSelectionChange"
        >
          <template #item="{ item }">
            <span class="text-xl font-semibold">{{ item.label }}</span>
            <p class="text-xs text-muted capitalize group-data-[selected=true]:text-foreground">
              {{ RADIUS_OPTION_LABELS[item.value as RadiusId] }}
            </p>
          </template>
        </ListBox>
      </template>
    </Popover>
  </div>
</template>
