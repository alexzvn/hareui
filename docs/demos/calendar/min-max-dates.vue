<script setup lang="ts">
import { Calendar, Description } from 'herouse'
import { getLocalTimeZone, today } from '@internationalized/date'

const now = today(getLocalTimeZone())
const minDate = now
const maxDate = now.add({ months: 3 })
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar aria-label="Appointment date" :min-value="minDate" :max-value="maxDate" />
    <Description class="text-center">
      Select a date between today and {{ maxDate.toString() }}
    </Description>
  </div>
</template>
