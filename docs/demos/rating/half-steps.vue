<template>
  <div class="flex flex-col items-center gap-3">
    <Rating v-model="score" :step="0.5" hoverable aria-label="Rate the soundtrack" />
    <p class="text-sm text-muted">Soundtrack: {{ score.toFixed(1) }}</p>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { ref } from 'vue'

const score = ref(3.5)
</script>
