<template>
  <Sheet close-button title="Sheet Title" class="mx-auto max-h-[95vh] max-w-[420px]">
    <Button variant="secondary"> Open Sheet </Button>
    <template #body>
      <p class="text-sm text-muted">
        This sheet rises from the bottom of the screen. Drag the handle or swipe the sheet down to
        close it, or press the close button.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Cancel </Button>
      <Button variant="secondary" @click="close"> Confirm </Button>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
</script>
