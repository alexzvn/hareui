<template>
  <div class="flex w-full max-w-xs flex-col gap-2">
    <Carousel
      ref="carousel"
      v-slot="{ item, index }"
      :items="STEPS"
      arrows
      aria-label="Hike plan"
      @select="current = $event"
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

    <div class="flex items-center justify-between gap-2">
      <Button size="sm" variant="secondary" @click="carousel?.emblaApi?.scrollTo(0)">
        Start over
      </Button>
      <p class="text-sm text-muted tabular-nums">Step {{ current + 1 }} of {{ STEPS.length }}</p>
      <Button size="sm" variant="secondary" @click="carousel?.emblaApi?.scrollTo(STEPS.length - 1)">
        Last step
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Card } from '@hareui/vue'
import { Carousel } from '@hareui/vue/carousel'
import { ref, useTemplateRef } from 'vue'

const STEPS = [
  { title: 'Pack', text: 'Water, layers and a map.' },
  { title: 'Park', text: 'Leave the car at the north lot.' },
  { title: 'Climb', text: 'Two switchbacks to the ridge.' },
  { title: 'Rest', text: 'Lunch by the upper lake.' },
  { title: 'Return', text: 'Take the river path down.' },
]

const carousel = useTemplateRef('carousel')
const current = ref(0)
</script>
