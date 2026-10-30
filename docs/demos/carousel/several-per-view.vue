<template>
  <Carousel
    v-slot="{ item }"
    :items="FORECAST"
    :options="{ align: 'start' }"
    :ui="{ item: 'basis-1/3' }"
    arrows
    aria-label="Weekly forecast"
    class="w-full max-w-sm"
  >
    <div class="p-1">
      <Card
        class="select-none"
        :ui="{ content: 'flex aspect-square flex-col items-center justify-center gap-1' }"
      >
        <span class="text-sm text-muted">{{ item.day }}</span>
        <Icon aria-hidden="true" class="size-6 text-foreground" :icon="item.icon" />
        <span class="text-xl font-semibold tabular-nums">{{ item.high }}°</span>
      </Card>
    </div>
  </Carousel>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Carousel } from '@hareui/vue/carousel'
import { Icon } from '@iconify/vue'

const FORECAST = [
  { day: 'Mon', icon: 'gravity-ui:sun', high: 24 },
  { day: 'Tue', icon: 'gravity-ui:sun', high: 26 },
  { day: 'Wed', icon: 'gravity-ui:cloud', high: 21 },
  { day: 'Thu', icon: 'gravity-ui:droplet', high: 17 },
  { day: 'Fri', icon: 'gravity-ui:thunderbolt', high: 18 },
  { day: 'Sat', icon: 'gravity-ui:cloud', high: 20 },
  { day: 'Sun', icon: 'gravity-ui:sun', high: 23 },
]
</script>
