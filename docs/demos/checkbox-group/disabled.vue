<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'

const items: CheckboxGroupItem[] = [
  { value: 'feature1', label: 'Feature 1', description: 'This feature is coming soon' },
  { value: 'feature2', label: 'Feature 2', description: 'This feature is coming soon' },
]
</script>

<template>
  <CheckboxGroup
    disabled
    name="disabled-features"
    label="Features"
    description="Feature selection is temporarily disabled"
    :items="items"
  />
</template>
