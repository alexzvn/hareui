<script setup lang="ts">
import { RadioGroup, Surface } from '@hareui/vue'

const items = [
  { value: 'basic', label: 'Basic Plan', description: 'Includes 100 messages per month' },
  { value: 'premium', label: 'Premium Plan', description: 'Includes 200 messages per month' },
  { value: 'business', label: 'Business Plan', description: 'Unlimited messages' },
]
</script>

<template>
  <Surface class="w-full rounded-3xl p-6">
    <RadioGroup
      default-value="premium"
      name="plan-on-surface"
      variant="secondary"
      label="Plan selection"
      description="Choose the plan that suits you best"
      :items="items"
    />
  </Surface>
</template>
