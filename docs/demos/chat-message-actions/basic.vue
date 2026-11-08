<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="max-w-lg">
    <template #actions>
      <ChatMessageActions :actions="actions" :message="message" />
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatMessageActions } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'lentils',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Soak the lentils for an hour, then simmer them for twenty minutes with a bay leaf. Salt them only at the end, so the skins stay tender.',
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
