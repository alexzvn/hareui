<template>
  <div class="h-96 w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter :items="items">
      <template #mailboxes>Mailboxes</template>
      <template #message>Message</template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const items: SplitterItem[] = [
  {
    slot: 'mailboxes',
    defaultSize: 30,
    minSize: 20,
    maxSize: 45,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'message',
    defaultSize: 70,
    class: 'items-center justify-center text-sm font-medium',
  },
]
</script>
