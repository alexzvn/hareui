<script setup lang="ts">
import { Slider } from 'herouse'
</script>

<template>
  <div class="flex h-64 items-center justify-center">
    <Slider class="h-full" label="Volume" :default-value="30" orientation="vertical" />
  </div>
</template>
