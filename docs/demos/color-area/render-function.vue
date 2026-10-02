<script setup lang="ts">
import { ColorArea } from 'herouse'
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <ColorArea default-value="rgb(116, 52, 255)" data-custom="slider" />
</template>
