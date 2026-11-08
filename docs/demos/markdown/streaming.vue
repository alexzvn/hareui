<template>
  <div class="flex w-full max-w-xl flex-col gap-3">
    <ChatMessage role="user" :parts="[{ type: 'text', text: question }]" />
    <ChatMessage role="assistant" icon="icon-[gravity-ui--sparkles]">
      <template #content>
        <ChatLoader v-if="!value" label="The assistant is thinking" />
        <Markdown v-else :value="value" :streaming="isStreaming" />
      </template>
    </ChatMessage>
    <Button
      size="sm"
      variant="secondary"
      class="self-start"
      :disabled="isStreaming"
      @click="replay"
    >
      <Icon icon="gravity-ui:arrow-rotate-left" />
      {{ isStreaming ? 'Streaming…' : 'Replay' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, ChatLoader, ChatMessage } from '@hareui/vue'
import { Markdown } from '@hareui/vue/markdown'
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, ref } from 'vue'

const question = 'How do I stop a search box from firing on every keystroke?'

const answer = `Wait until typing **pauses** before you search. Restart a short timer on every keystroke:

\`\`\`ts
const query = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

const onInput = (text: string) => {
  clearTimeout(timer)
  timer = setTimeout(() => (query.value = text), 300)
}
\`\`\`

Pick the delay by how the box should feel:

| Delay | Feels |
| ---: | --- |
| 100 ms | Instant, but sends many requests |
| 300 ms | A good default for search |
| 600 ms | Sluggish while typing |

Clear the timer in \`onBeforeUnmount\`, so a late search can't land after the component is gone.`

const value = ref(answer)
const isStreaming = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

// Sends the answer a few characters at a time, as a chat model would.
const sendNextChunk = () => {
  value.value = answer.slice(0, value.value.length + 5)
  isStreaming.value = value.value.length < answer.length
  if (isStreaming.value) timer = setTimeout(sendNextChunk, 30)
}

// The loader shows until the first characters arrive.
const replay = () => {
  clearTimeout(timer)
  value.value = ''
  isStreaming.value = true
  timer = setTimeout(sendNextChunk, 900)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
