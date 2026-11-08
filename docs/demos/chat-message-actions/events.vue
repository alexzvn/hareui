<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="max-w-lg">
    <template #actions>
      <ChatMessageActions :actions="actions" :message="message" @action="onAction" @copy="onCopy">
        <span class="ms-2 self-center text-xs text-muted">{{ log }}</span>
      </ChatMessageActions>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatMessageActions } from '@hareui/vue'
import { ref } from 'vue'

const message: ChatMessageData = {
  id: 'packing',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Pack a rain shell and a warm layer.' },
    { type: 'text', text: 'Mountain weather turns fast after noon.' },
  ],
}

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'regenerate' }]

const log = ref('Click a button.')

const onAction = (action: ChatMessageAction) => {
  log.value = `action: ${action.kind}`
}

const onCopy = (text: string) => {
  log.value = `copy: ${text.length} characters`
}
</script>
