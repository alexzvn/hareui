<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { Button, ButtonGroup, Calendar, Description } from 'herouse'
import { getLocalTimeZone, parseDate, startOfMonth, startOfWeek, today } from '@internationalized/date'
import { ref } from 'vue'

const value = ref<DateValue | null>(null)
const focusedDate = ref<DateValue>(parseDate('2025-12-25'))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <ButtonGroup full-width size="sm" variant="tertiary">
      <Button
        @click="() => {
          const todayDate = today(getLocalTimeZone())
          value = todayDate
          focusedDate = todayDate
        }"
      >
        Today
      </Button>
      <Button
        @click="() => {
          const nextWeekStart = startOfWeek(today(getLocalTimeZone()), 'en-US')
          value = nextWeekStart
          focusedDate = nextWeekStart
        }"
      >
        Week
      </Button>
      <Button
        @click="() => {
          const nextMonthStart = startOfMonth(today(getLocalTimeZone()))
          value = nextMonthStart
          focusedDate = nextMonthStart
        }"
      >
        Month
      </Button>
    </ButtonGroup>

    <Calendar aria-label="Event date" v-model="value" v-model:placeholder="focusedDate" />

    <Description class="text-center">
      Selected date: {{ value ? value.toString() : '(none)' }}
    </Description>

    <div class="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        @click="() => {
          const todayDate = today(getLocalTimeZone())
          value = todayDate
          focusedDate = todayDate
        }"
      >
        Set Today
      </Button>
      <Button
        size="sm"
        variant="secondary"
        @click="() => {
          const christmasDate = parseDate('2025-12-25')
          value = christmasDate
          focusedDate = christmasDate
        }"
      >
        Set Christmas
      </Button>
      <Button size="sm" variant="tertiary" @click="value = null">
        Clear
      </Button>
    </div>
  </div>
</template>
