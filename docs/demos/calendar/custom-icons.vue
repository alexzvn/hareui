<script setup lang="ts">
import { Calendar } from 'herouse'
</script>

<template>
  <Calendar aria-label="Event date">
    <template #navIcon="{ direction }">
      <span class="text-xs font-bold">{{ direction === 'previous' ? '«' : '»' }}</span>
    </template>
  </Calendar>
</template>
