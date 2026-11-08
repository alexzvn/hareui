<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #reasoning>
      <ChainOfThought :steps="steps" :duration="6" default-open />
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep, ChatMessageData } from '@hareui/vue'
import { ChainOfThought, ChatMessage } from '@hareui/vue'

const steps: ChainOfThoughtStep[] = [
  {
    label: 'Read the question',
    content: 'The user wants a chai recipe that serves four and is not too sweet.',
  },
  {
    label: 'Check the recipe card',
    content: 'The house recipe uses 2 tbsp of sugar per cup. For four cups, halve it to 4 tbsp.',
  },
  {
    label: 'Answer',
    content: 'Give the scaled amounts and suggest steeping the milk two minutes less.',
  },
]

const message: ChatMessageData = {
  id: 'chai',
  role: 'assistant',
  parts: [
    {
      type: 'reasoning',
      text: 'Scale the house chai recipe to four cups and cut the sugar.',
      state: 'done',
    },
    {
      type: 'text',
      text: 'For four cups, use 4 tbsp of sugar instead of 8. Steep the milk for 3 minutes rather than 5 so the spices stay bright.',
    },
  ],
}
</script>
