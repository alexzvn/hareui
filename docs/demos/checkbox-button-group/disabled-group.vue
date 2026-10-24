<template>
  <CheckboxButtonGroup
    disabled
    class="w-[360px]"
    name="coverage"
    label="Travel cover"
    description="Cover can't be changed after check-in."
    variant="secondary"
    :default-value="['baggage', 'medical']"
  >
    <CheckboxButtonGroupItem
      v-for="item in coverage"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :description="item.description"
    />
  </CheckboxButtonGroup>
</template>

<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const coverage = [
  { value: 'baggage', label: 'Lost baggage', description: 'Up to $1,000 per checked bag' },
  { value: 'delay', label: 'Flight delay', description: 'Meals and hotel after a 6-hour delay' },
  { value: 'medical', label: 'Medical care', description: 'Emergency treatment abroad' },
]
</script>
