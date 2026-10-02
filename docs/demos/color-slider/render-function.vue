<script setup lang="ts">
import { ColorSlider } from 'herouse'
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <ColorSlider
    channel="hue"
    class="w-full max-w-xs"
    data-custom="foo"
    default-value="hsl(0, 100%, 50%)"
    label="Hue"
  />
</template>
