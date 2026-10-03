<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { DatePicker } from '@hareui/vue'
</script>

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
