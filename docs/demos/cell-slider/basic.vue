<template>
  <div class="w-[252px]">
    <CellSlider
      label="Brightness"
      :default-value="60"
      :format-options="{ style: 'unit', unit: 'percent' }"
    />
  </div>
</template>

<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
</script>
