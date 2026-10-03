<script setup lang="ts">
import { Description, RangeCalendar } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar aria-label="Trip dates" disabled />
    <Description class="text-center">
      Range calendar is disabled
    </Description>
  </div>
</template>
