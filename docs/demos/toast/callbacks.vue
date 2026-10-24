<script setup lang="ts">
import { Button, toast } from '@hareui/vue'
import { ref } from 'vue'

const closedHistory = ref<Array<{ message: string; time: string }>>([])

function addToHistory(message: string) {
  const time = new Date().toLocaleTimeString()
  closedHistory.value = [{ message, time }, ...closedHistory.value].slice(0, 5)
}
</script>

<template>
  <div class="flex h-full max-w-2xl flex-col items-center justify-center gap-6">
    <div class="flex w-full flex-wrap items-center justify-center gap-4">
      <Button
        size="sm"
        variant="secondary"
        @click="
          toast('File saved', {
            timeout: 3000,
            onClose: () => addToHistory('File saved (closed after 3 seconds)'),
          })
        "
      >
        Custom timeout (3s)
      </Button>
      <Button
        size="sm"
        variant="secondary"
        @click="
          toast('Changes saved', {
            timeout: 10000,
            onClose: () => addToHistory('Changes saved (closed after 10 seconds)'),
          })
        "
      >
        Custom timeout (10s)
      </Button>
      <Button
        size="sm"
        variant="secondary"
        @click="
          toast.success('Event created', {
            onClose: () => addToHistory('Event created (closed after default timeout)'),
          })
        "
      >
        With onClose callback
      </Button>
      <Button
        size="sm"
        variant="secondary"
        @click="
          toast('Important notification', {
            description: 'This toast will stay until dismissed',
            timeout: 0,
            onClose: () => addToHistory('Important notification (manually closed)'),
          })
        "
      >
        Persistent toast
      </Button>
    </div>

    <div class="w-full space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium">Closed History</h3>
        <Button
          v-if="closedHistory.length > 0"
          class="h-6 text-xs"
          size="sm"
          variant="tertiary"
          @click="closedHistory = []"
        >
          Clear
        </Button>
      </div>
      <div class="min-h-[120px] space-y-2 rounded-lg border border-border bg-surface p-4">
        <p v-if="closedHistory.length === 0" class="text-sm text-muted">
          No toasts closed yet. Try closing one above!
        </p>
        <div
          v-for="(item, index) in closedHistory"
          :key="`${item.time}-${index}`"
          class="flex animate-in items-start justify-between gap-3 rounded-md border border-border bg-default px-3 py-2 text-sm duration-200 fade-in slide-in-from-top-2"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="flex-1">
            <span class="font-medium">{{ item.message }}</span>
            <span class="ms-2 text-xs text-muted">({{ item.time }})</span>
          </div>
          <div
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success-soft-foreground"
          >
            <svg
              class="size-3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
