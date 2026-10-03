<script setup lang="ts">
import { Button, ToastProvider, ToastQueue } from '@hareui/vue'

const queue = new ToastQueue()

function show() {
  queue.add({ title: 'Simple message', variant: 'default' })
  setTimeout(() => queue.add({ title: 'Operation completed', variant: 'success' }), 400)
  setTimeout(() => queue.add({ title: 'New update available', variant: 'accent' }), 800)
}
</script>

<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <ToastProvider is-expanded aria-label="Expanded notifications" placement="bottom" :queue="queue" />
    <Button size="sm" variant="secondary" @click="show">
      Show 3 toasts
    </Button>
  </div>
</template>
