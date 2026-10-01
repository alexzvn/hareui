<script setup lang="ts">
import { RadioGroup } from 'herouse'

const primaryItems = [
  { value: 'option1', label: 'Option 1', description: 'Standard styling with default background' },
  { value: 'option2', label: 'Option 2', description: 'Another option with primary styling' },
]

const secondaryItems = [
  { value: 'option1', label: 'Option 1', description: 'Lower emphasis variant for use in surfaces' },
  { value: 'option2', label: 'Option 2', description: 'Another option with secondary styling' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Primary variant
      </p>
      <RadioGroup default-value="option1" name="primary-plan" variant="primary" :items="primaryItems" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Secondary variant
      </p>
      <RadioGroup default-value="option1" name="secondary-plan" variant="secondary" :items="secondaryItems" />
    </div>
  </div>
</template>
