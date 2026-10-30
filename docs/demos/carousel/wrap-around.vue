<template>
  <Carousel
    v-slot="{ item, index }"
    :items="STEPS"
    :options="{ loop: true }"
    arrows
    aria-label="Hike plan"
    class="w-full max-w-xs"
  >
    <div class="p-1">
      <Card
        class="select-none"
        :ui="{
          content: 'flex aspect-square flex-col items-center justify-center gap-2 text-center',
        }"
      >
        <span class="text-4xl font-semibold tabular-nums">{{ index + 1 }}</span>
        <span class="text-sm font-medium">{{ item.title }}</span>
        <span class="text-xs text-muted">{{ item.text }}</span>
      </Card>
    </div>
  </Carousel>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Carousel } from '@hareui/vue/carousel'

const STEPS = [
  { title: 'Pack', text: 'Water, layers and a map.' },
  { title: 'Park', text: 'Leave the car at the north lot.' },
  { title: 'Climb', text: 'Two switchbacks to the ridge.' },
  { title: 'Rest', text: 'Lunch by the upper lake.' },
  { title: 'Return', text: 'Take the river path down.' },
]
</script>
