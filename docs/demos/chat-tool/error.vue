<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #tool="{ part }">
      <ChatTool :part="part" default-open />
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatTool } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'changelog',
  role: 'assistant',
  parts: [
    { type: 'text', text: "I'll read the release notes to see what changed." },
    {
      type: 'tool-fetchPage',
      toolCallId: 'call-fetch',
      state: 'output-error',
      input: { url: 'https://example.com/changelog' },
      errorText: 'The page took longer than 10 seconds to respond.',
    },
    { type: 'text', text: "The site isn't responding. Want me to try again in a minute?" },
  ],
}
</script>
