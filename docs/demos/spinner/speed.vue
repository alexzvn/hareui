<script setup lang="ts">
import { Spinner } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <Spinner class="animate-[spin_1.5s_linear_infinite] motion-reduce:animate-none" />
      <span class="text-xs text-muted">Slow</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Spinner />
      <span class="text-xs text-muted">Default</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <Spinner class="animate-[spin_0.4s_linear_infinite] motion-reduce:animate-none" />
      <span class="text-xs text-muted">Fast</span>
    </div>
  </div>
</template>
