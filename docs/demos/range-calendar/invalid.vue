<script setup lang="ts">
import type { DateRange } from 'herouse'
import { Description, RangeCalendar } from 'herouse'
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref } from 'vue'

const now = today(getLocalTimeZone())
const value = ref<DateRange>({ start: now.add({ days: 6 }), end: now.add({ days: 14 }) })
const isInvalid = computed(() => !!value.value.end && !!value.value.start && value.value.end.compare(value.value.start) > 7)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar aria-label="Trip dates" v-model="value" first-day-of-week="mon" :invalid="isInvalid" />
    <p v-if="isInvalid" class="text-sm text-danger">
      Maximum stay duration is 1 week
    </p>
    <Description v-else class="text-center">
      Select a stay of up to 7 days
    </Description>
  </div>
</template>
