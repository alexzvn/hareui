<template>
  <!--
    Attributes passed to the component fall through to its root element; this demo shows an
    arbitrary attribute landing on the field.
  -->
  <DatePicker
    data-custom="date-picker"
    class="w-72"
    name="date"
    label="Date"
    calendar-label="Event date"
  />
</template>

<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
</script>
