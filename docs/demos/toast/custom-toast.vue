<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <ToastProvider
      placement="bottom"
      :queue="customQueue"
      :ui="{ toast: 'rounded-xl border border-border' }"
    >
      <template #toast="{ content, close }">
        <div class="flex items-center gap-2">
          <svg
            aria-hidden="true"
            class="size-4 shrink-0 text-accent-soft-foreground"
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
          <div class="flex flex-col pe-6">
            <p
              v-if="(content as ToastContentValue).title"
              class="text-sm font-medium text-accent-soft-foreground"
            >
              {{ (content as ToastContentValue).title }}
            </p>
            <p v-if="(content as ToastContentValue).description" class="text-sm text-muted">
              {{ (content as ToastContentValue).description }}
            </p>
          </div>
        </div>
        <CloseButton
          class="absolute end-2 top-1/2 -translate-y-1/2 border-none bg-transparent opacity-100 [&>svg]:size-4"
          @click="close"
        />
      </template>
    </ToastProvider>
    <Button size="sm" variant="secondary" @click="show"> Custom toast </Button>
  </div>
</template>

<script setup lang="ts">
import type { ToastContentValue } from '@hareui/vue'
import { Button, CloseButton, ToastProvider, ToastQueue } from '@hareui/vue'

const customQueue = new ToastQueue()

const show = () => {
  customQueue.add({
    title: 'Meeting in 10 minutes',
    description: 'Design review · Room 4B',
    variant: 'default',
  })
}
</script>
