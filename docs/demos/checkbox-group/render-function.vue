<script setup lang="ts">
import { CheckboxGroup } from 'herouse'

const items = [
  { value: 'coding', label: 'Coding', description: 'Love building software' },
  { value: 'design', label: 'Design', description: 'Enjoy creating beautiful interfaces' },
  { value: 'writing', label: 'Writing', description: 'Passionate about content creation' },
]
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <CheckboxGroup
    name="interests"
    data-custom="foo"
    label="Select your interests"
    description="Choose all that apply"
    :items="items"
  />
</template>
