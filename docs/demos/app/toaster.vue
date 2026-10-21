<script setup lang="ts">
import { App, Button, ToastQueue } from '@hareui/vue'

// In your app, call `toast()`. The preview uses a queue of its own so the page's other toasters stay out of it.
const queue = new ToastQueue()
</script>

<template>
  <App :toaster="{ placement: 'top end', queue }">
    <Button variant="secondary" @click="queue.add({ title: 'Invitation sent' })">Show toast</Button>
  </App>
</template>
