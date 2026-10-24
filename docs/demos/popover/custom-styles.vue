<script setup lang="ts">
import { Button, Popover } from '@hareui/vue'
</script>

<template>
  <Popover
    :ui="{
      base: 'max-w-56 overflow-hidden rounded-xl border border-border/80 bg-surface/90 p-0 shadow-xl ring-1 ring-black/5 backdrop-blur-xl dark:border-border/90 dark:bg-surface/85 dark:ring-white/10',
      dialog: 'relative p-4',
    }"
  >
    <Button variant="secondary">Details</Button>
    <template #content>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-neutral-500/6 to-transparent dark:from-neutral-400/8"
      />
      <h3
        data-slot="popover-heading"
        class="relative font-medium text-neutral-800 dark:text-neutral-100"
      >
        Keyboard shortcuts
      </h3>
      <dl class="relative mt-3 space-y-2 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted">Save</dt>
          <dd class="font-mono text-neutral-700 dark:text-neutral-300">⌘ S</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted">Search</dt>
          <dd class="font-mono text-neutral-700 dark:text-neutral-300">⌘ K</dd>
        </div>
      </dl>
    </template>
  </Popover>
</template>
