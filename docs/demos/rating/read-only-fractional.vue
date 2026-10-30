<template>
  <div class="flex items-center gap-2">
    <span class="text-2xl font-semibold">{{ average }}</span>
    <div class="flex flex-col gap-0.5">
      <Rating readonly :aria-label="`Average ${average} out of 5`" :default-value="average" />
      <span class="text-xs text-muted">from 1,284 guests</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'

const average = 4.3
</script>
