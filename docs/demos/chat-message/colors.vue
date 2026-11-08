<template>
  <div class="flex w-full max-w-xl flex-col gap-4">
    <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
      <span class="text-xs text-muted">{{ variant }}</span>
      <div class="flex flex-wrap gap-2">
        <ChatMessage
          v-for="item in items"
          :key="item.color"
          :variant="variant"
          :color="item.color"
          :parts="[{ type: 'text', text: item.text }]"
          class="w-auto"
          :ui="{ body: 'pe-0' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageProps } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

type Item = {
  color: NonNullable<ChatMessageProps['color']>
  text: string
}

const variants: NonNullable<ChatMessageProps['variant']>[] = ['primary', 'soft', 'outline']

const items: Item[] = [
  { color: 'default', text: 'Draft saved' },
  { color: 'accent', text: 'New reply from Lena' },
  { color: 'success', text: 'Payment received' },
  { color: 'warning', text: 'Your trial ends in 3 days' },
  { color: 'danger', text: "Couldn't reach the server" },
]
</script>
