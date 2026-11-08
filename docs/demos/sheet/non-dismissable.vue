<template>
  <Sheet
    :dismissible="false"
    :keyboard-dismissible="false"
    :handle="false"
    title="Confirm Action"
    class="mx-auto max-w-[420px]"
  >
    <Button variant="secondary"> Important Action </Button>
    <template #body>
      <p class="text-sm text-muted">
        Pressing outside, pressing Escape or swiping won't close this sheet. Pick one of the buttons
        below instead.
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
