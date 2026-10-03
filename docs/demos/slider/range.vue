<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>

<template>
  <Slider
    class="w-full max-w-xs"
    label="Price Range"
    :default-value="[100, 500]"
    :format-options="{ currency: 'USD', style: 'currency' }"
    :max="1000"
    :min="0"
    :step="50"
  />
</template>
