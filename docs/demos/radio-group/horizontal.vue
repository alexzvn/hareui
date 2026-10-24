<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Label, RadioGroup } from '@hareui/vue'

const items: RadioGroupItem[] = [
  { value: 'starter', label: 'Starter', description: 'For side projects' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting' },
  { value: 'teams', label: 'Teams', description: 'Up to 10 teammates' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <Label>Subscription plan</Label>
    <RadioGroup
      default-value="pro"
      name="plan-orientation"
      orientation="horizontal"
      :items="items"
    />
  </div>
</template>
