<template>
  <div class="grid w-full max-w-xl gap-4 sm:grid-cols-2">
    <figure class="grid gap-2 p-3">
      <CellColorPicker default-value="#A855F7" label="Tag color" />
      <figcaption class="text-center text-xs text-muted">
        <code>default</code> on the page
      </figcaption>
    </figure>
    <figure class="grid gap-2 rounded-2xl bg-surface p-3 shadow-surface">
      <CellColorPicker default-value="#A855F7" label="Tag color" variant="secondary" />
      <figcaption class="text-center text-xs text-muted">
        <code>secondary</code> on a surface
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { CellColorPicker } from '@hareui/vue'
</script>
