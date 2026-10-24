<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
</script>

<template>
  <!--
    HeroUI's render-function demo shows a render prop customizing each sub-part; Option A has no
    compound parts to render-prop into. Vue's natural attrs fallthrough reaches the same root
    element instead, so this demo shows an arbitrary attribute landing on the field.
  -->
  <DatePicker
    data-custom="date-picker"
    class="w-72"
    name="date"
    label="Date"
    calendar-label="Event date"
  />
</template>
