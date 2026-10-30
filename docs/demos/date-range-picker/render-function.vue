<template>
  <!--
    Attributes passed to `DateRangePicker` fall through to the root element.
  -->
  <DateRangePicker
    data-custom="foo"
    class="w-80"
    full-width
    start-name="startDate"
    end-name="endDate"
    label="Trip dates"
    calendar-label="Trip dates"
  />
</template>

<script setup lang="ts">
import { DateRangePicker } from '@hareui/vue'
</script>
