<template>
  <DatePicker
    class="w-72"
    name="international-date"
    label="Event date"
    calendar-label="Event date"
    locale="hi-IN-u-ca-indian"
    :default-value="today(getLocalTimeZone())"
  />
</template>

<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
</script>
