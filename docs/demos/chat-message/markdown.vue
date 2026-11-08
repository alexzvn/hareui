<template>
  <div class="flex w-full max-w-xl flex-col gap-2">
    <ChatMessage :message="question" />
    <ChatMessage :message="answer" icon="icon-[gravity-ui--sparkles]">
      <template #text="{ part }">
        <Markdown :value="part.text" />
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'
import { Markdown } from '@hareui/vue/markdown'

const question: ChatMessageData = {
  id: 'question',
  role: 'user',
  parts: [{ type: 'text', text: 'How do I wait until the user stops typing before searching?' }],
}

const answer: ChatMessageData = {
  id: 'answer',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: `### Debounce the query

Run the search only once the input has been quiet for a moment:

- Keep the raw text in a \`ref\`.
- Restart a timer on every change.
- Search when the timer fires, about **300 ms** later.

\`\`\`ts
let timer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => search(value), 300)
})
\`\`\``,
    },
  ],
}
</script>
