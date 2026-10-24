<script setup lang="ts">
import { Slider } from '@hareui/vue'
import { ref } from 'vue'

const value = ref(25)
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <Slider v-model="value" label="Volume" />
    <p class="text-sm text-muted">Current value: {{ value }}</p>
  </div>
</template>
