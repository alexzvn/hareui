<template>
  <div class="flex flex-col items-start gap-3">
    <p class="text-sm text-muted">
      Status: <span class="font-mono text-foreground">{{ isOpen ? 'open' : 'closed' }}</span>
    </p>
    <Button variant="secondary" @click="isOpen = true"> Publish Post </Button>

    <AlertDialog
      v-model:open="isOpen"
      class="sm:max-w-[400px]"
      status="accent"
      title="Publish this post?"
    >
      <template #body>
        <p>It will be visible to everyone with the link, and subscribers get an email.</p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close"> Cancel </Button>
        <Button @click="close"> Publish </Button>
      </template>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>
