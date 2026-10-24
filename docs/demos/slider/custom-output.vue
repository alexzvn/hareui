<template>
  <Slider class="w-full max-w-xs" label="Range" :default-value="[25, 75]">
    <template #output="{ formatted }">
      {{ formatted.join(' – ') }}
    </template>
  </Slider>
</template>

<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>
