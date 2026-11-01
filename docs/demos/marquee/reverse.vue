<template>
  <div class="flex w-full flex-col gap-4">
    <Marquee :ui="{ root: '[--marquee-gap:--spacing(3)]' }">
      <Chip v-for="topic in topics.slice(0, 6)" :key="topic" :label="topic" size="lg" />
    </Marquee>
    <Marquee reverse :ui="{ root: '[--marquee-gap:--spacing(3)]' }">
      <Chip v-for="topic in topics.slice(6)" :key="topic" :label="topic" size="lg" />
    </Marquee>
  </div>
</template>

<script setup lang="ts">
import { Chip, Marquee } from '@hareui/vue'

const topics = [
  'Sourdough',
  'Cold brew',
  'Pickling',
  'Fermentation',
  'Knife skills',
  'Pasta from scratch',
  'Meal prep',
  'Spice blends',
  'Slow cooking',
  'Baking bread',
  'Smoking',
  'Plant-based',
]
</script>
