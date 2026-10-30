<template>
  <Carousel
    v-slot="{ item }"
    :items="NOTES"
    auto-height
    dots
    aria-label="Trail notes"
    class="w-full max-w-xs"
    :ui="{ container: 'items-start transition-[height] duration-300' }"
  >
    <Card :title="item.title" class="select-none">
      <p class="text-sm text-muted">{{ item.text }}</p>
    </Card>
  </Carousel>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Carousel } from '@hareui/vue/carousel'

const NOTES = [
  { title: 'Start', text: 'Gate opens at 7.' },
  {
    title: 'Ridge',
    text: 'The ridge is exposed: bring a wind layer, keep to the cairns when the fog rolls in, and turn back if you lose them. The view from the far end is worth the extra hour.',
  },
  { title: 'Lake', text: 'Swimming is allowed past the boathouse.' },
  {
    title: 'Descent',
    text: 'Loose gravel on the last switchbacks. Poles help, and the river path is gentler on the knees.',
  },
]
</script>
