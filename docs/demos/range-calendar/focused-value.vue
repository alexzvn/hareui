<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { Button, Description, RangeCalendar } from '@hareui/vue'
import { parseDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const focusedDate = shallowRef<DateValue>(parseDate('2025-06-15'))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar aria-label="Trip dates" first-day-of-week="mon" v-model:placeholder="focusedDate" />

    <Description class="text-center">
      Focused: {{ focusedDate.toString() }}
    </Description>

    <div class="flex flex-wrap justify-center gap-2">
      <Button size="sm" variant="secondary" @click="focusedDate = parseDate('2025-01-01')">
        Go to Jan
      </Button>
      <Button size="sm" variant="secondary" @click="focusedDate = parseDate('2025-06-15')">
        Go to Jun
      </Button>
      <Button size="sm" variant="secondary" @click="focusedDate = parseDate('2025-12-25')">
        Go to Christmas
      </Button>
    </div>
  </div>
</template>
