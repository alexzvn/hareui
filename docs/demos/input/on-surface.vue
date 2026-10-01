<script setup lang="ts">
import { Input } from 'herouse'
</script>

<template>
  <!-- herouse has no Surface component; these are HeroUI's `Surface` (variant "default") classes -->
  <div data-slot="surface" class="relative flex h-[180px] w-[280px] items-center justify-center rounded-3xl bg-surface p-4 text-surface-foreground">
    <Input class="w-full" placeholder="Your name" variant="secondary" />
  </div>
</template>
