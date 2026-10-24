<script setup lang="ts">
import type { DateRange } from '@hareui/vue'
import { Button, ButtonGroup, Description, RangeCalendar } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import {
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  startOfWeek,
  today,
} from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateRange | undefined>()
const focusedDate = shallowRef<DateValue>(parseDate('2025-12-25'))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <ButtonGroup variant="tertiary">
      <Button @click="focusedDate = today(getLocalTimeZone())"> This week </Button>
      <Button
        @click="focusedDate = startOfWeek(today(getLocalTimeZone()).add({ weeks: 1 }), 'en-US')"
      >
        Next week
      </Button>
      <Button @click="focusedDate = startOfMonth(today(getLocalTimeZone()).add({ months: 1 }))">
        Next month
      </Button>
    </ButtonGroup>

    <RangeCalendar
      aria-label="Trip dates"
      first-day-of-week="mon"
      v-model="value"
      v-model:placeholder="focusedDate"
    />

    <Description class="text-center">
      Selected range:
      {{
        value?.start && value?.end
          ? `${value.start.toString()} -> ${value.end.toString()}`
          : '(none)'
      }}
    </Description>

    <div class="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        @click="
          () => {
            const start = today(getLocalTimeZone())
            value = { start, end: start.add({ days: 6 }) }
            focusedDate = start
          }
        "
      >
        Set 1 week
      </Button>
      <Button
        size="sm"
        variant="secondary"
        @click="
          () => {
            const start = parseDate('2025-12-20')
            value = { start, end: parseDate('2025-12-31') }
            focusedDate = start
          }
        "
      >
        Set Holidays
      </Button>
      <Button size="sm" variant="tertiary" @click="value = undefined"> Clear </Button>
    </div>
  </div>
</template>
