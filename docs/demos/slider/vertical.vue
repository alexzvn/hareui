<template>
  <div class="flex h-64 items-center justify-center">
    <Slider class="h-full" label="Volume" :default-value="30" orientation="vertical" />
  </div>
</template>

<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>
