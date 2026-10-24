<script setup lang="ts">
import { DateRangePicker } from '@hareui/vue'
</script>

<template>
  <!--
    HeroUI's render-function demo swaps the root element through a `render` prop. Option A has no
    `render` prop; attributes passed to `DateRangePicker` fall through to the root element instead.
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
