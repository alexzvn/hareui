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
    name="plan"
    label="Plan selection"
    description="Choose the plan that suits you best"
    :items="items"
  />
</template>
