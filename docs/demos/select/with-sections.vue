<script setup lang="ts">
import { Select } from '@hareui/vue'

const countries = [
  { type: 'section' as const, label: 'North America', items: [
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'mexico', label: 'Mexico' },
  ] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Europe', items: [
    { value: 'uk', label: 'United Kingdom' },
    { value: 'france', label: 'France' },
    { value: 'germany', label: 'Germany' },
    { value: 'spain', label: 'Spain' },
    { value: 'italy', label: 'Italy' },
  ] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Asia', items: [
    { value: 'japan', label: 'Japan' },
    { value: 'china', label: 'China' },
    { value: 'india', label: 'India' },
    { value: 'south-korea', label: 'South Korea' },
  ] },
]
</script>

<template>
  <Select class="w-[256px]" label="Country" placeholder="Select a country" :items="countries" />
</template>
