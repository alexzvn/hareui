<script setup lang="ts">
import { Button, ToastProvider, ToastQueue } from '@hareui/vue'

const notificationQueue = new ToastQueue({ maxVisibleToasts: 2 })
const errorQueue = new ToastQueue({ maxVisibleToasts: 3 })
const successQueue = new ToastQueue({ maxVisibleToasts: 1 })
</script>

<template>
  <div class="flex h-full max-w-4xl items-center justify-center gap-4">
    <ToastProvider placement="bottom" :queue="notificationQueue" />
    <div class="flex justify-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        @click="
          notificationQueue.add({
            title: 'New notification',
            description: 'You have a new message',
            variant: 'default',
          })
        "
      >
        Add notification (max 2)
      </Button>
    </div>

    <ToastProvider placement="bottom start" :queue="errorQueue" />
    <div class="flex justify-center gap-2">
      <Button
        size="sm"
        variant="danger-soft"
        @click="
          errorQueue.add({
            title: 'Error occurred',
            description: 'Failed to save changes',
            variant: 'danger',
          })
        "
      >
        Add error (max 3)
      </Button>
    </div>

    <ToastProvider placement="bottom end" :queue="successQueue" />
    <div class="flex justify-center gap-2">
      <Button
        class="text-success-soft-foreground"
        size="sm"
        variant="secondary"
        @click="
          successQueue.add({
            title: 'Success!',
            description: `Operation ${Date.now()}`,
            variant: 'success',
          })
        "
      >
        Add success (max 1)
      </Button>
    </div>
  </div>
</template>
