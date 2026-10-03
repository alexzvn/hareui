<script setup lang="ts">
import { ColorArea } from '@hareui/vue'
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <ColorArea default-value="rgb(116, 52, 255)" data-custom="slider" />
</template>
