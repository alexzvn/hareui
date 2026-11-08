<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage :message="question" />
    <ChatMessage
      v-model:feedback="feedback"
      :message="answer"
      icon="icon-[gravity-ui--sparkles]"
      :actions="actions"
    />
    <span class="text-xs text-muted">{{ summary }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData, ChatMessageFeedback } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'
import { computed, ref } from 'vue'

const question: ChatMessageData = {
  id: 'question',
  role: 'user',
  parts: [{ type: 'text', text: 'How long do I boil an egg for a runny yolk?' }],
}

const answer: ChatMessageData = {
  id: 'answer',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Six minutes from boiling water, then straight into cold water for a minute.',
    },
  ],
}

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'dislike' }]

const feedback = ref<ChatMessageFeedback>(null)

const summaries = {
  like: 'Thanks, glad it helped.',
  dislike: "Thanks, we'll use this to improve answers.",
} as const

const summary = computed(() => (feedback.value ? summaries[feedback.value] : 'Rate this answer.'))
</script>
