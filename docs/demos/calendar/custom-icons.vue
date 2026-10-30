<template>
  <Calendar aria-label="Event date">
    <template #navIcon="{ direction }">
      <span class="text-xs font-bold">{{ direction === 'previous' ? '«' : '»' }}</span>
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { Calendar } from '@hareui/vue'
</script>
