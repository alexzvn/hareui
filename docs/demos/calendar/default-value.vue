<script setup lang="ts">
import { Calendar } from '@hareui/vue'
import { parseDate } from '@internationalized/date'
</script>

<template>
  <Calendar aria-label="Event date" :default-value="parseDate('2025-02-14')" />
</template>
