<template>
  <Carousel :items="FORECAST" thumbnails aria-label="Weekly forecast" class="w-full max-w-xs">
    <template #default="{ item }">
      <div class="p-1">
        <Card
          class="select-none"
          :ui="{ content: 'flex aspect-video flex-col items-center justify-center gap-2' }"
        >
          <Icon aria-hidden="true" class="size-10 text-foreground" :icon="item.icon" />
          <span class="text-3xl font-semibold tabular-nums">{{ item.high }}°</span>
          <span class="text-sm text-muted">{{ item.day }}</span>
        </Card>
      </div>
    </template>

    <template #thumbnail="{ item: day, selected }">
      <span
        class="flex size-full flex-col items-center justify-center gap-0.5 bg-default text-xs"
        :class="selected ? 'text-foreground' : 'text-muted'"
      >
        <Icon aria-hidden="true" class="size-4" :icon="day.icon" />
        {{ day.day }}
      </span>
    </template>
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
