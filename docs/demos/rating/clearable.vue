<template>
  <div class="flex flex-col items-center gap-3">
    <Rating v-model="score" clearable aria-label="Rate this podcast episode" />
    <p class="text-center text-sm text-muted">
      {{ score ? 'Press the same star again to remove your rating' : 'No rating' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { ref } from 'vue'

const score = ref(4)
</script>
