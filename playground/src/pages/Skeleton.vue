<script setup lang="ts">
import { Skeleton } from '@hareui/vue'

const animationTypes = ['shimmer', 'pulse', 'none'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Skeleton</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Animation types</h2>
      <div class="grid max-w-xl grid-cols-3 gap-6">
        <div v-for="animationType in animationTypes" :key="animationType" class="space-y-3">
          <span class="text-xs text-muted">{{ animationType }}</span>
          <Skeleton :animation-type="animationType" class="h-20 rounded-lg" />
          <Skeleton :animation-type="animationType" class="h-3 w-3/5 rounded-lg" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Single shimmer (parent container)</h2>
      <div class="relative grid max-w-xl grid-cols-3 gap-4 overflow-hidden rounded-xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:-translate-x-full before:animate-skeleton before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] before:mix-blend-overlay before:content-['']">
        <Skeleton v-for="i in 3" :key="i" animation-type="none" class="h-24 rounded-xl" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default slot</h2>
      <Skeleton class="w-fit rounded-lg p-2">
        <span class="invisible">Loading text</span>
      </Skeleton>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Skeleton class="h-10 w-40" :ui="{ base: 'rounded-full bg-accent/20' }" />
    </section>
  </div>
</template>
