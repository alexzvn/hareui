<script setup lang="ts">
import { Calendar } from '@hareui/vue'
import type { CalendarIdentifier } from '@internationalized/date'
import { createCalendar, getLocalTimeZone, today, toCalendar } from '@internationalized/date'

const locale = 'hi-IN-u-ca-indian'
const calendarId = new Intl.DateTimeFormat(locale).resolvedOptions().calendar as CalendarIdentifier
const defaultValue = toCalendar(today(getLocalTimeZone()), createCalendar(calendarId))
</script>

<template>
  <Calendar aria-label="Event date" :locale="locale" :default-value="defaultValue" year-picker />
</template>
