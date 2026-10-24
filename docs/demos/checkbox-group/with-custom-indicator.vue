<template>
  <CheckboxGroup
    name="features"
    label="Features"
    description="Select the features you want"
    :items="items"
  >
    <template #indicator="{ checked }">
      <svg
        v-if="checked"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </template>
  </CheckboxGroup>
</template>

<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'

const items: CheckboxGroupItem[] = [
  {
    value: 'notifications',
    label: 'Email notifications',
    description: 'Receive updates via email',
  },
  { value: 'newsletter', label: 'Newsletter', description: 'Get weekly newsletters' },
]
</script>
