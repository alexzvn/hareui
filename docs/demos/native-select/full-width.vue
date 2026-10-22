<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'run', label: 'Running' },
  { value: 'ride', label: 'Cycling' },
  { value: 'swim', label: 'Swimming' },
  { value: 'strength', label: 'Strength training' },
]
</script>

<template>
  <div class="w-[400px] space-y-4">
    <NativeSelect full-width label="Workout type" name="workout" placeholder="What did you do today?" :items="items" />
  </div>
</template>
