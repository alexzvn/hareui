<script setup lang="ts">
import { RangeCalendar } from 'herouse'
import { parseDate } from '@internationalized/date'
</script>

<template>
  <RangeCalendar aria-label="Trip dates" :default-value="{ start: parseDate('2025-02-03'), end: parseDate('2025-02-12') }" first-day-of-week="mon" />
</template>
