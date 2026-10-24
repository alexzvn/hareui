<script setup lang="ts">
import { CellSlider } from '@hareui/vue'

const percent: Intl.NumberFormatOptions = { style: 'unit', unit: 'percent' }
</script>

<template>
  <div class="grid w-[260px] gap-1.5">
    <CellSlider label="Contrast" :default-value="40" :format-options="percent" disabled />
    <CellSlider label="Saturation" :default-value="70" :format-options="percent" disabled />
    <p class="mt-1 text-xs text-muted">Locked while the “Film” preset is applied.</p>
  </div>
</template>
