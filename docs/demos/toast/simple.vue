<script setup lang="ts">
import { Button, toast } from 'herouse'
</script>

<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <div class="flex w-full flex-wrap items-center justify-center gap-4">
      <Button size="sm" variant="secondary" @click="toast('Simple message')">
        Default
      </Button>
      <Button size="sm" variant="secondary" @click="toast.success('Operation completed')">
        Success
      </Button>
      <Button size="sm" variant="secondary" @click="toast.info('New update available')">
        Info
      </Button>
      <Button size="sm" variant="secondary" @click="toast.warning('Please check your settings')">
        Warning
      </Button>
      <Button size="sm" variant="secondary" @click="toast.danger('Something went wrong')">
        Error
      </Button>
    </div>
  </div>
</template>
