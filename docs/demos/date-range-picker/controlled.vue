<script setup lang="ts">
import type { DateRangeValue } from '@hareui/vue'
import { Button, DateRangePicker, Description } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { shallowRef } from 'vue'

const start = today(getLocalTimeZone())
const value = shallowRef<DateRangeValue | null>({ start, end: start.add({ days: 4 }) })

function setWeek() {
  const nextStart = today(getLocalTimeZone())
  value.value = { start: nextStart, end: nextStart.add({ days: 6 }) }
}
</script>

<template>
  <div class="flex w-80 flex-col gap-4">
    <DateRangePicker
      v-model="value"
      full-width
      start-name="startDate"
      end-name="endDate"
      label="Trip dates"
      calendar-label="Trip dates"
    />
    <Description>
      Current value:
      {{ value ? `${value.start.toString()} -> ${value.end.toString()}` : '(empty)' }}
    </Description>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="setWeek"> Set week </Button>
      <Button variant="tertiary" @click="value = null"> Clear </Button>
    </div>
  </div>
</template>
