<template>
  <div class="flex flex-col items-center gap-4">
    <ToastProvider
      placement="bottom"
      :queue="queue"
      :ui="{
        toast:
          'rounded-xl border border-border/80 bg-surface shadow-lg ring-1 ring-black/5 dark:ring-white/10',
      }"
    >
      <template #toast="{ content }">
        <div class="flex items-center gap-2.5">
          <svg
            aria-hidden="true"
            class="size-4 shrink-0 text-neutral-600 dark:text-neutral-400"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              clip-rule="evenodd"
              d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
          <div class="flex flex-col gap-0.5">
            <p
              v-if="(content as ToastContentValue).title"
              class="text-sm font-medium text-neutral-900 dark:text-neutral-50"
            >
              {{ (content as ToastContentValue).title }}
            </p>
            <p
              v-if="(content as ToastContentValue).description"
              class="text-sm text-neutral-600 dark:text-neutral-400"
            >
              {{ (content as ToastContentValue).description }}
            </p>
          </div>
        </div>
      </template>
    </ToastProvider>
    <Button size="sm" variant="secondary" @click="show"> Show toast </Button>
  </div>
</template>

<script setup lang="ts">
import type { ToastContentValue } from '@hareui/vue'
import { Button, ToastProvider, ToastQueue } from '@hareui/vue'

const queue = new ToastQueue()

function show() {
  queue.add({ title: 'Saved', description: 'Draft synced', variant: 'default' })
}
</script>
