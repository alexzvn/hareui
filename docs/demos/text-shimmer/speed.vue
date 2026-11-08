<template>
  <div class="flex flex-col gap-3 text-sm text-foreground">
    <TextShimmer text="Quick sweep, narrow band" :duration="1.5" :spread="2" />
    <TextShimmer text="Default sweep and band" />
    <TextShimmer text="Slow sweep, wide band" :duration="4" :spread="8" />
  </div>
</template>

<script setup lang="ts">
import { TextShimmer } from '@hareui/vue'
</script>
