<script setup lang="ts">
import { ColorSwatch } from '@hareui/vue'

const colors = ['#0485F7', '#EF4444', '#F59E0B', '#10B981', '#D946EF']
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Glow Effect</span>
      <div class="flex items-center gap-4">
        <ColorSwatch v-for="color in colors" :key="color" :color="color" size="xl" :style="{ boxShadow: `0 0 20px 2px ${color}` }" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Gradient</span>
      <div class="flex items-center gap-4">
        <ColorSwatch v-for="color in colors" :key="`grad-${color}`" :color="color" size="xl">
          <template #default="{ color: c }">
            <div :style="{ background: `linear-gradient(135deg, ${c}, white)` }" class="size-full rounded-[inherit]" />
          </template>
        </ColorSwatch>
      </div>
    </div>
  </div>
</template>
