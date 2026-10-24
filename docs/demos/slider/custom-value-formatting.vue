<template>
  <Slider
    class="w-full max-w-xs"
    label="Price"
    :default-value="60"
    :format-options="{ currency: 'USD', style: 'currency' }"
  />
</template>

<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>
