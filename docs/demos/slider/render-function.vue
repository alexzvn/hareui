<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <Slider class="w-full max-w-xs" data-custom="foo" label="Volume" :default-value="30" />
</template>
