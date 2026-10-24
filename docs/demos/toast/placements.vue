<template>
  <div class="flex h-full flex-col items-center justify-center gap-6">
    <ToastProvider v-for="p in placements" :key="p" :placement="p" :queue="placementQueues[p]" />
    <div class="flex max-w-xs flex-wrap justify-center gap-2">
      <Button v-for="p in placements" :key="p" size="sm" variant="secondary" @click="showToast(p)">
        {{ p }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, ToastProvider, ToastQueue } from '@hareui/vue'

const placements = ['top start', 'top', 'top end', 'bottom start', 'bottom', 'bottom end'] as const
type Placement = (typeof placements)[number]

// A separate queue per placement, so each `ToastProvider` below stacks independently.
const placementQueues: Record<Placement, ToastQueue> = Object.fromEntries(
  placements.map((p) => [p, new ToastQueue({ maxVisibleToasts: 3 })]),
) as Record<Placement, ToastQueue>

function showToast(placement: Placement) {
  placementQueues[placement].add({
    title: 'Event created',
    description: 'Event has been created',
    variant: 'default',
  })
}
</script>
