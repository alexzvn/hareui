<template>
  <App :toaster="{ queue }">
    <div class="flex flex-wrap items-center justify-center gap-3">
      <Button variant="secondary" @click="queue.add({ title: 'Event created' })">Show toast</Button>
      <Button variant="secondary" @click="queue.add({ title: 'Changes saved', variant: 'success' })"
        >Show success toast</Button
      >
    </div>
  </App>
</template>

<script setup lang="ts">
import { App, Button, ToastQueue } from '@hareui/vue'

// In your app, call `toast()`: App's toaster shows the shared queue. This page already renders a
// toaster for that queue, so the preview gives its App a queue of its own to show each toast once.
const queue = new ToastQueue()
</script>
