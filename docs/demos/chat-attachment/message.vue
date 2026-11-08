<template>
  <ChatMessage :message="message" class="w-full max-w-lg" />
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'whiteboard',
  role: 'user',
  parts: [
    {
      type: 'file',
      mediaType: 'image/jpeg',
      url: 'https://picsum.photos/id/20/240/240',
      filename: 'whiteboard.jpg',
    },
    { type: 'text', text: 'Can you turn this whiteboard into a task list for Q3?' },
  ],
}
</script>
