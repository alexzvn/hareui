<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { DatePicker } from '@hareui/vue'
import { computed, shallowRef } from 'vue'

const value = shallowRef<DateValue | null>(null)
const todayDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value !== null && value.value.compare(todayDate) < 0)
</script>

<template>
  <DatePicker
    v-model="value"
    required
    class="w-72"
    :invalid="isInvalid"
    :min-value="todayDate"
    name="date"
    label="Appointment date"
    calendar-label="Event date"
    error-message="Date must be today or in the future."
  />
</template>
