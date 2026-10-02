<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { DatePicker } from 'herouse'
</script>

<template>
  <DatePicker
    disabled
    class="w-72"
    name="date"
    label="Date"
    calendar-label="Event date"
    :model-value="today(getLocalTimeZone())"
    description="This date picker is disabled."
  />
</template>
