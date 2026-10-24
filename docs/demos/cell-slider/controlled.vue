<template>
  <div class="flex w-[252px] flex-col gap-2">
    <CellSlider
      v-model="speed"
      label="Playback speed"
      :min="0.5"
      :max="2"
      :step="0.25"
      :format-options="{ minimumFractionDigits: 2 }"
    />
    <p class="px-1 text-sm text-muted">
      A 40-minute episode takes {{ Math.round(40 / speed) }} minutes.
    </p>
  </div>
</template>

<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
import { ref } from 'vue'

const speed = ref(1.25)
</script>
