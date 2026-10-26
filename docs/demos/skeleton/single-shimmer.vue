<template>
  <!-- HeroUI's `.skeleton--shimmer` parent rule, written as utilities on the container -->
  <div
    class="relative grid w-full max-w-xl grid-cols-3 gap-4 overflow-hidden rounded-xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:-translate-x-full before:animate-skeleton before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] before:mix-blend-overlay before:content-['']"
  >
    <Skeleton animation-type="none" class="h-24 rounded-xl" />
    <Skeleton animation-type="none" class="h-24 rounded-xl" />
    <Skeleton animation-type="none" class="h-24 rounded-xl" />
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@hareui/vue'
</script>
