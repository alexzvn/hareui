<template>
  <div class="flex items-center gap-3">
    <ColorSwatch
      v-for="color in colors"
      :key="color"
      :color="color"
      :style="{ boxShadow: `0 0 20px 2px ${color}` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ColorSwatch } from '@hareui/vue'

const colors = ['#0485F7', '#EF4444', '#F59E0B', '#10B981', '#D946EF']
</script>
