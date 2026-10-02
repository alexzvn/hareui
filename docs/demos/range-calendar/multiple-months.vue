<script setup lang="ts">
import { RangeCalendar } from 'herouse'
</script>

<template>
  <RangeCalendar aria-label="Trip dates" class="@container-normal w-full max-w-none overflow-x-auto" :number-of-months="2" />
</template>
