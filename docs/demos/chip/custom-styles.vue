<template>
  <div class="flex flex-wrap items-center gap-2">
    <Chip class="rounded-full bg-default-soft px-3 text-default-soft-foreground">Draft</Chip>
    <Chip class="rounded-full bg-warning-soft px-3 text-warning-soft-foreground">In review</Chip>
    <Chip class="rounded-full bg-success-soft px-3 text-success-soft-foreground">Published</Chip>
  </div>
</template>

<script setup lang="ts">
import { Chip } from '@hareui/vue'
</script>
