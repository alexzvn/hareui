<script setup lang="ts">
import { CellSelect } from '@hareui/vue'
import { reactive } from 'vue'

const settings = reactive([
  {
    key: 'weekStart',
    label: 'Week starts on',
    value: 'mon',
    options: [
      { value: 'mon', label: 'Monday' },
      { value: 'sun', label: 'Sunday' },
      { value: 'sat', label: 'Saturday' },
    ],
  },
  {
    key: 'timeFormat',
    label: 'Time format',
    value: '24h',
    options: [
      { value: '12h', label: '12-hour' },
      { value: '24h', label: '24-hour' },
    ],
  },
  {
    key: 'reminder',
    label: 'Reminder',
    value: '15',
    options: [
      { value: '5', label: '5 min before' },
      { value: '15', label: '15 min before' },
      { value: '60', label: '1 hour before' },
    ],
  },
])
</script>

<template>
  <section class="w-80 rounded-3xl bg-surface p-2 shadow-surface">
    <h3 class="px-3 pt-2 pb-3 text-sm font-semibold">Calendar</h3>
    <div class="grid gap-1.5">
      <CellSelect
        v-for="setting in settings"
        :key="setting.key"
        v-model="setting.value"
        :items="setting.options"
        :label="setting.label"
        variant="secondary"
      />
    </div>
  </section>
</template>
