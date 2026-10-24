<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup, Surface } from '@hareui/vue'

const items: CheckboxGroupItem[] = [
  { value: 'coding', label: 'Coding', description: 'Love building software' },
  { value: 'design', label: 'Design', description: 'Enjoy creating beautiful interfaces' },
  { value: 'writing', label: 'Writing', description: 'Passionate about content creation' },
]
</script>

<template>
  <Surface class="w-full rounded-3xl p-6">
    <CheckboxGroup
      name="interests"
      variant="secondary"
      label="Select your interests"
      description="Choose all that apply"
      :items="items"
    />
  </Surface>
</template>
