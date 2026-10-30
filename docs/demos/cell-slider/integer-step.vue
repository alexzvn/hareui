<template>
  <div class="w-[252px]">
    <CellSlider label="Editor font size" :default-value="14" :min="10" :max="24" />
  </div>
</template>

<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
</script>
