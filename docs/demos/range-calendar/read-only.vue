<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar
      aria-label="Trip dates"
      :default-value="{ start: now, end: now.add({ days: 4 }) }"
      readonly
    />
    <Description class="text-center"> Range calendar is read-only </Description>
  </div>
</template>

<script setup lang="ts">
import { Description, RangeCalendar } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'

const now = today(getLocalTimeZone())
</script>
