<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
import { ref } from 'vue'

const sets = ref<number | null>(3)
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <NumberStepper v-model="sets" aria-label="Sets" :min="1" :max="8" />
    <p class="text-sm text-muted">{{ sets }} × 12 reps of squats</p>
  </div>
</template>
