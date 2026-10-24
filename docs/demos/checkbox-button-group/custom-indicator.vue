<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const goals = [
  {
    value: 'steps',
    label: 'Daily steps',
    description: 'Walk more between meetings',
    target: '8,000',
    unit: 'steps',
  },
  {
    value: 'water',
    label: 'Hydration',
    description: 'Get a nudge every two hours',
    target: '2',
    unit: 'litres',
  },
  {
    value: 'sleep',
    label: 'Sleep',
    description: 'Wind down at the same time each night',
    target: '7.5',
    unit: 'hours',
  },
]
</script>

<template>
  <CheckboxButtonGroup
    class="w-[380px]"
    name="goals"
    label="Weekly goals"
    variant="secondary"
    :default-value="['steps', 'sleep']"
  >
    <CheckboxButtonGroupItem
      v-for="goal in goals"
      :key="goal.value"
      :value="goal.value"
      :label="goal.label"
      :description="goal.description"
    >
      <template #indicator>
        <Icon icon="gravity-ui:flame" />
      </template>
      <span class="mt-2 text-xs text-muted">
        Target: <span class="font-semibold text-foreground">{{ goal.target }} {{ goal.unit }}</span>
      </span>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>
