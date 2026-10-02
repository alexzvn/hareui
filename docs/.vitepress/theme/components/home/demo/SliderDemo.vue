<script setup lang="ts">
import { Slider } from 'herouse'
</script>

<template>
  <div class="w-[256px] px-1">
    <Slider
      class="w-full max-w-xs"
      :default-value="250"
      :format-options="{ currency: 'USD', style: 'currency' }"
      label="Price"
      :max="500"
      :min="0"
      :step="10"
    />
  </div>
</template>
