<template>
  <div class="flex flex-col gap-4">
    <RadioGroup v-model="value" name="plan-controlled" label="Subscription plan" :items="items" />
    <p class="text-sm text-muted">
      Selected plan: <span class="font-medium">{{ value }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { RadioGroup } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('pro')

const items: RadioGroupItem[] = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates' },
]
</script>
