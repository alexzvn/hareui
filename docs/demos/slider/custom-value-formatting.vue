<script setup lang="ts">
import { Slider } from 'herouse'
</script>

<template>
  <Slider
    class="w-full max-w-xs"
    label="Price"
    :default-value="60"
    :format-options="{ currency: 'USD', style: 'currency' }"
  />
</template>
