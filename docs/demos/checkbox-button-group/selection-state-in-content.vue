<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const extras = [
  { value: 'oat-milk', label: 'Oat milk', description: 'Swap dairy in every drink', price: 0.6 },
  { value: 'extra-shot', label: 'Extra shot', description: 'A second espresso shot', price: 0.9 },
  {
    value: 'vanilla',
    label: 'Vanilla syrup',
    description: 'House-made, lightly sweet',
    price: 0.5,
  },
]

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
</script>

<template>
  <CheckboxButtonGroup
    class="w-[360px]"
    name="coffee-extras"
    label="Make it yours"
    variant="secondary"
    :default-value="['extra-shot']"
  >
    <CheckboxButtonGroupItem
      v-for="extra in extras"
      :key="extra.value"
      :value="extra.value"
      :label="extra.label"
      :description="extra.description"
    >
      <template #default="{ selected }">
        <span class="mt-2 text-sm font-semibold" :class="{ 'text-accent': selected }">
          {{ selected ? 'Added' : 'Add' }} · {{ gbp.format(extra.price) }}
        </span>
      </template>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>
