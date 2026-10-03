<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <Button disabled>Primary</Button>
    <Button disabled variant="secondary">Secondary</Button>
    <Button disabled variant="tertiary">Tertiary</Button>
    <Button disabled variant="outline">Outline</Button>
    <Button disabled variant="ghost">Ghost</Button>
    <Button disabled variant="danger">Danger</Button>
  </div>
</template>
