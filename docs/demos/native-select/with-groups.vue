<template>
  <div class="w-[220px]">
    <NativeSelect aria-label="Font family" placeholder="Font family" :items="fonts" />
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const fonts = [
  { label: 'Sans serif', items: ['Inter', 'Roboto', 'Source Sans 3'] },
  { label: 'Serif', items: ['Merriweather', 'Lora', 'Georgia'] },
  { label: 'Monospace', items: ['JetBrains Mono', 'Fira Code', 'Menlo'] },
]
</script>
