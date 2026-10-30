<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <Timeline
      :items="items"
      :model-value="active"
      size="sm"
      :ui="{ item: 'cursor-(--cursor-interactive)' }"
      @select="onSelect"
    />
    <p class="text-xs text-muted">Selected: {{ items[active]?.title }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TimelineItem } from '@hareui/vue'
import { Timeline } from '@hareui/vue'
import { ref } from 'vue'

const active = ref(0)

const items: TimelineItem[] = [
  { title: 'Arrive at the trailhead', date: '07:00' },
  { title: 'Reach the ridge', date: '09:30' },
  { title: 'Lunch at the lake', date: '12:00' },
  { title: 'Back at the car park', date: '15:30' },
]

const onSelect = (_event: MouseEvent, item: TimelineItem) => {
  active.value = items.findIndex((entry) => entry.title === item.title)
}
</script>
