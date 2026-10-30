<template>
  <div class="flex flex-col items-center gap-3">
    <Rating v-model="score" aria-label="Rate your workout" />
    <p class="text-sm text-muted">
      {{ score ? `Workout rated ${score} of 5` : 'How hard was it?' }}
    </p>
    <Button size="sm" variant="secondary" :disabled="!score" @click="score = 0">Reset</Button>
  </div>
</template>

<script setup lang="ts">
import { Button, Rating } from '@hareui/vue'
import { ref } from 'vue'

const score = ref(2)
</script>
