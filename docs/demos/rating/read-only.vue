<template>
  <div class="flex items-center gap-2">
    <Rating readonly size="sm" aria-label="Rated 4 out of 5" :default-value="4" />
    <span class="text-sm text-muted">Your review from March</span>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
</script>
