<script setup lang="ts">
import { Spinner } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg', 'xl'] as const
const colors = ['accent', 'current', 'danger', 'success', 'warning'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Spinner</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex items-center gap-6">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center gap-2">
          <Spinner :size="size" />
          <span class="text-xs text-muted">{{ size }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Colors</h2>
      <div class="flex items-center gap-6 rounded-xl border border-border bg-surface p-4">
        <div v-for="color in colors" :key="color" class="flex flex-col items-center gap-2">
          <Spinner :color="color" />
          <span class="text-xs text-muted">{{ color }}</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Spinner :ui="{ base: 'text-danger' }" size="lg" />
    </section>
  </div>
</template>
