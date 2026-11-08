<template>
  <Sheet close-button title="Swipe the sheet" class="mx-auto max-w-[420px]">
    <Button variant="secondary"> Handle Only </Button>
    <template #body>
      <p class="text-sm text-muted">
        On touch, swipe anywhere on the sheet until it is fully expanded. From then on the body
        scrolls instead. With a mouse, drag the handle.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Done </Button>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
</script>
