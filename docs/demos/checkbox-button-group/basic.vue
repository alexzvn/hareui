<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const interests = [
  { value: 'beaches', label: 'Beaches', description: 'Coastal towns, swimming spots and boat trips' },
  { value: 'museums', label: 'Museums', description: 'Galleries, history tours and local exhibits' },
  { value: 'hiking', label: 'Hiking', description: 'Day trails, viewpoints and mountain huts' },
]
</script>

<template>
  <CheckboxButtonGroup
    class="w-[360px]"
    name="interests"
    label="Trip interests"
    description="We'll suggest stops that match"
    variant="secondary"
    :default-value="['beaches', 'hiking']"
  >
    <CheckboxButtonGroupItem
      v-for="interest in interests"
      :key="interest.value"
      :value="interest.value"
      :label="interest.label"
      :description="interest.description"
    />
  </CheckboxButtonGroup>
</template>
