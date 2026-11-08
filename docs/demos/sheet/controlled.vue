<template>
  <div class="flex flex-col items-start gap-4">
    <div class="flex items-center gap-3">
      <Button size="sm" variant="secondary" @click="isOpen = true"> Open Sheet </Button>
      <Button size="sm" variant="secondary" @click="isOpen = !isOpen"> Toggle </Button>
      <p class="text-xs text-muted">
        Status:
        <span class="font-mono font-medium text-foreground">{{ isOpen ? 'open' : 'closed' }}</span>
      </p>
    </div>
    <Sheet
      v-model:open="isOpen"
      close-button
      title="Controlled Sheet"
      class="mx-auto max-w-[420px]"
    >
      <template #body>
        <p class="text-sm text-muted">
          <code>v-model:open</code> binds this sheet to state in the parent, which opens and closes
          it from anywhere.
        </p>
      </template>
      <template #footer="{ close }">
        <Button @click="close"> Close </Button>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>
