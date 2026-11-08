<template>
  <div class="flex h-[360px] w-full max-w-2xl flex-col rounded-2xl border border-border">
    <ChatConversation
      :messages="messages"
      :assistant="{ icon: 'icon-[gravity-ui--sparkles]' }"
      :should-scroll-to-bottom="false"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatConversation } from '@hareui/vue'

const lessons: [string, string][] = [
  ['How do I say "good morning" in Spanish?', '"Buenos días." Use it until about noon.'],
  ['And in the afternoon?', '"Buenas tardes", from lunch until it gets dark.'],
  ['What about late at night?', '"Buenas noches." It works as both a greeting and a goodbye.'],
  ['How do I ask someone their name?', '"¿Cómo te llamas?" With a stranger, say "¿Cómo se llama?"'],
  ['How do I answer?', '"Me llamo Sam", or just "Soy Sam".'],
  ['How do I say "nice to meet you"?', '"Mucho gusto." The reply is often "Igualmente".'],
]

const messages: ChatMessageData[] = lessons.flatMap(([question, answer], index) => [
  { id: `${index}-q`, role: 'user', parts: [{ type: 'text', text: question }] },
  { id: `${index}-a`, role: 'assistant', parts: [{ type: 'text', text: answer }] },
])
</script>
