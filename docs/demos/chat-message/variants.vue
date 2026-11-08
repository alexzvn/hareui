<template>
  <div class="flex w-full max-w-lg flex-col gap-4">
    <div v-for="item in items" :key="item.variant" class="flex flex-col gap-1">
      <span class="text-xs text-muted">{{ item.caption }}</span>
      <ChatMessage :variant="item.variant" :parts="[{ type: 'text', text: item.text }]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageProps } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

type Item = {
  variant: NonNullable<ChatMessageProps['variant']>
  caption: string
  text: string
}

const items: Item[] = [
  { variant: 'primary', caption: 'primary', text: 'Your table for four is booked for 19:30.' },
  {
    variant: 'secondary',
    caption: 'secondary',
    text: 'I moved the dentist appointment to Thursday.',
  },
  { variant: 'soft', caption: 'soft', text: 'Three new comments on the launch plan.' },
  { variant: 'outline', caption: 'outline', text: 'The invoice was sent to finance.' },
  {
    variant: 'tertiary',
    caption: 'tertiary (no bubble)',
    text: 'The package left the depot this morning and should arrive by noon.',
  },
]
</script>
