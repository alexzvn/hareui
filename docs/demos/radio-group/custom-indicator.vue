<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { RadioGroup } from '@hareui/vue'

const items: RadioGroupItem[] = [
  { value: 'basic', label: 'Basic Plan', description: 'Includes 100 messages per month' },
  { value: 'premium', label: 'Premium Plan', description: 'Includes 200 messages per month' },
  { value: 'business', label: 'Business Plan', description: 'Unlimited messages' },
]
</script>

<template>
  <RadioGroup
    default-value="premium"
    name="plan-custom-indicator"
    label="Plan selection"
    description="Choose the plan that suits you best"
    :items="items"
  >
    <template #indicator="{ checked }">
      <span v-if="checked" class="text-xs leading-none text-background">✓</span>
    </template>
  </RadioGroup>
</template>
