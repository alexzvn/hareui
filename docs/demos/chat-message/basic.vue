<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage :message="question" />
    <ChatMessage :message="answer" icon="icon-[gravity-ui--sparkles]" :actions="actions" />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

const question: ChatMessageData = {
  id: 'question',
  role: 'user',
  parts: [{ type: 'text', text: 'Can I swap butter for olive oil in banana bread?' }],
}

const answer: ChatMessageData = {
  id: 'answer',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Yes. Use about three quarters of the amount, so 85 ml of oil for 115 g of butter.\nThe loaf turns out moister, with a faint fruity note.',
    },
  ],
}

const actions: ChatMessageAction[] = [
  { kind: 'copy' },
  { kind: 'like' },
  { kind: 'dislike' },
  { kind: 'regenerate' },
]
</script>
