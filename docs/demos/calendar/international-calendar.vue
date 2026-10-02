<script setup lang="ts">
import { createCalendar, getLocalTimeZone, today, toCalendar } from '@internationalized/date'
import { Calendar } from 'herouse'

const locale = 'hi-IN-u-ca-indian'
const calendarId = new Intl.DateTimeFormat(locale).resolvedOptions().calendar
const defaultValue = toCalendar(today(getLocalTimeZone()), createCalendar(calendarId))
</script>

<template>
  <Calendar aria-label="Event date" :locale="locale" :default-value="defaultValue" year-picker />
</template>
