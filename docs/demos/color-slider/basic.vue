<script setup lang="ts">
import { ColorSlider } from '@hareui/vue'
</script>

<template>
  <ColorSlider
    channel="hue"
    class="w-full max-w-xs"
    default-value="hsl(0, 100%, 50%)"
    label="Hue"
  />
</template>
