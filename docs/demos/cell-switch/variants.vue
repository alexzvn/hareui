<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
</script>

<template>
  <div class="grid w-[440px] grid-cols-2 gap-4">
    <figure v-for="variant in (['default', 'secondary'] as const)" :key="variant" class="grid gap-2">
      <CellSwitch label="Auto-save" :variant="variant" :default-value="true" />
      <figcaption class="text-center font-mono text-[11px] text-muted">
        variant="{{ variant }}"
      </figcaption>
    </figure>
  </div>
</template>
