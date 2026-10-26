<template>
  <fieldset class="w-80 rounded-3xl border border-separator p-2">
    <legend class="px-2 text-xs font-medium text-muted">Chart colors</legend>
    <div class="grid gap-1.5 pt-1">
      <CellColorPicker
        v-for="activity in activities"
        :key="activity.name"
        :default-value="activity.color"
        :label="activity.name"
      />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { CellColorPicker } from '@hareui/vue'

const activities = [
  { name: 'Running', color: '#F97316' },
  { name: 'Cycling', color: '#0EA5E9' },
  { name: 'Swimming', color: '#14B8A6' },
]
</script>
