<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="max-w-lg">
    <template #actions>
      <ChatMessageActions v-model:feedback="feedback" :actions="actions" :message="message">
        <span v-if="feedback" class="ms-2 self-center text-xs text-muted">{{ thanks }}</span>
      </ChatMessageActions>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData, ChatMessageFeedback } from '@hareui/vue'
import { ChatMessage, ChatMessageActions } from '@hareui/vue'
import { computed, ref } from 'vue'

const message: ChatMessageData = {
  id: 'commute',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'The 7:42 train gets you to Central at 8:15. If it runs late, the 8:05 bus stops two blocks from your office and takes about 35 minutes.',
    },
  ],
}

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'dislike' }]

const feedback = ref<ChatMessageFeedback>(null)

const thanks = computed(() =>
  feedback.value === 'like'
    ? 'Thanks, glad it helped.'
    : 'Thanks, this helps us improve the answers.',
)
</script>
