<template>
  <div class="flex h-[420px] w-full max-w-2xl flex-col rounded-2xl border border-border">
    <ChatConversation
      :messages="messages"
      :user="{ variant: 'soft', color: 'accent' }"
      :assistant="{ avatar: { fallback: 'IV', color: 'success' }, actions }"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatConversation } from '@hareui/vue'

const messages: ChatMessageData[] = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'The leaves on my fiddle-leaf fig are getting brown spots.' }],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Brown spots in the middle of the leaf usually mean the roots stay wet for too long. How often do you water it, and does the pot have a drainage hole?',
      },
    ],
  },
  {
    id: '3',
    role: 'user',
    parts: [{ type: 'text', text: 'Every Sunday, and no, it sits in a ceramic pot.' }],
  },
  {
    id: '4',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Move it to a plastic pot with drainage inside the ceramic one. Water only when the top 5 cm of soil feel dry, which is about every ten days in winter.',
      },
    ],
  },
]

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'dislike' }]
</script>
