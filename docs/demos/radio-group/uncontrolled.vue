<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { RadioGroup } from '@hareui/vue'
import { ref } from 'vue'

const selection = ref('pro')

const items: RadioGroupItem[] = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <RadioGroup
      default-value="pro"
      name="plan-uncontrolled"
      label="Subscription plan"
      :items="items"
      @update:model-value="(next) => (selection = next ?? selection)"
    />
    <p class="text-sm text-muted">
      Last chosen plan: <span class="font-medium">{{ selection }}</span>
    </p>
  </div>
</template>
