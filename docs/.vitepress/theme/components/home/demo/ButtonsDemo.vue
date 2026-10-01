<script setup lang="ts">
import { Button } from 'herouse'

const variants = ['primary', 'secondary', 'tertiary', 'danger', 'danger-soft', 'ghost'] as const
</script>

<template>
  <div class="grid grid-cols-3 gap-x-3 gap-y-2">
    <Button v-for="variant in variants" :key="variant" size="sm" :variant="variant">Click me</Button>
  </div>
</template>
