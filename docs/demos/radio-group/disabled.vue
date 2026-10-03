<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { RadioGroup } from '@hareui/vue'

const items: RadioGroupItem[] = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates' },
]
</script>

<template>
  <RadioGroup
    disabled
    default-value="pro"
    name="plan-disabled"
    label="Subscription plan"
    description="Plan changes are temporarily paused while we roll out updates."
    :items="items"
  />
</template>
