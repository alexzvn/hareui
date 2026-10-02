<script setup lang="ts">
import { Select } from 'herouse'

const animals = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat', disabled: true },
  { value: 'bird', label: 'Bird' },
  { value: 'kangaroo', label: 'Kangaroo', disabled: true },
  { value: 'elephant', label: 'Elephant' },
  { value: 'tiger', label: 'Tiger' },
]
</script>

<template>
  <Select class="w-[256px]" label="Animal" placeholder="Select an animal" :items="animals" />
</template>
