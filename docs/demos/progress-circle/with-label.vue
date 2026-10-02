<script setup lang="ts">
import { Label, ProgressCircle } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-3">
    <ProgressCircle aria-label="Loading" :value="75" />
    <Label>75% Complete</Label>
  </div>
</template>
