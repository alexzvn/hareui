<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage :message="question" />
    <ChatMessage :message="answer" />
    <PromptSuggestion :items="followUps" :trailing-icon="false" :ui="{ items: 'sm:grid-cols-1' }" />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage, PromptSuggestion } from '@hareui/vue'

const question: ChatMessageData = {
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'How long should I proof sourdough overnight?' }],
}

const answer: ChatMessageData = {
  id: '2',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'In the fridge, 12 to 16 hours works for most loaves. The dough is ready when a floured finger leaves a dent that springs back slowly.',
    },
  ],
}

const followUps = [
  'What if my kitchen is very warm?',
  'Can I bake it straight from the fridge?',
  'How do I tell if it is overproofed?',
]
</script>
