<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage :message="message" />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'receipt',
  role: 'user',
  parts: [
    {
      type: 'file',
      mediaType: 'image/jpeg',
      url: 'https://picsum.photos/id/42/480/480',
      filename: 'cafe-receipt.jpg',
    },
    {
      type: 'file',
      mediaType: 'application/pdf',
      url: 'https://example.com/files/expense-policy.pdf',
      filename: 'expense-policy.pdf',
    },
    { type: 'text', text: 'Does this lunch fit the expense policy?' },
  ],
}
</script>
