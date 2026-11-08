<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #reasoning="{ part }">
      <ChainOfThought :text="part.text" :duration="3" />
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChainOfThought, ChatMessage } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'call-time',
  role: 'assistant',
  parts: [
    {
      type: 'reasoning',
      text: 'Lisbon is in UTC+0 in winter and Tokyo is UTC+9, so a 10:00 call in Lisbon is 19:00 in Tokyo. That falls after office hours there, so an earlier slot works better.',
      state: 'done',
    },
    {
      type: 'text',
      text: 'A 10:00 call in Lisbon lands at 19:00 in Tokyo. Try 08:00 in Lisbon instead: that is 17:00 in Tokyo, still inside office hours.',
    },
  ],
}
</script>
