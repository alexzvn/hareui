<template>
  <dl class="grid w-72 grid-cols-[1fr_auto_2.5rem] items-center gap-x-4 gap-y-3">
    <template v-for="row in rows" :key="row.label">
      <dt class="text-sm">{{ row.label }}</dt>
      <dd>
        <Rating
          readonly
          size="sm"
          :aria-label="`${row.label}: ${row.score} out of 5`"
          :default-value="row.score"
        />
      </dd>
      <dd class="text-end text-sm text-muted tabular-nums">{{ row.score.toFixed(1) }}</dd>
    </template>
  </dl>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'

const rows = [
  { label: 'Cleanliness', score: 4.8 },
  { label: 'Location', score: 4.2 },
  { label: 'Check-in', score: 3.6 },
  { label: 'Wi-Fi', score: 2.4 },
]
</script>
