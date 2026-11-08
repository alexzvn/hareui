<template>
  <div class="flex h-[460px] w-full max-w-2xl flex-col rounded-2xl border border-border">
    <ChatConversation
      :messages="messages"
      :status="status"
      :assistant="{ icon: 'icon-[gravity-ui--sparkles]', actions }"
    />
    <PromptSuggestion
      v-if="suggestions.length"
      :items="suggestions"
      :disabled="status !== 'ready'"
      :trailing-icon="false"
      :ui="{ items: 'flex overflow-x-auto', item: 'w-auto shrink-0 py-2 whitespace-nowrap' }"
      class="border-t border-border p-3"
      @select="send"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  ChatMessageAction,
  ChatMessageData,
  ChatRole,
  ChatStatus,
  PromptSuggestionItem,
} from '@hareui/vue'
import { ChatConversation, PromptSuggestion } from '@hareui/vue'
import { onBeforeUnmount, ref } from 'vue'

type Turn = { id: string; role: ChatRole; text: string }

const toMessage = ({ id, role, text }: Turn): ChatMessageData => ({
  id,
  role,
  parts: [{ type: 'text', text }],
})

const thread: [ChatRole, string][] = [
  ['user', 'My first sourdough loaf came out flat. What went wrong?'],
  [
    'assistant',
    'A flat loaf usually means the dough was under-proofed or the starter was weak. Was your starter bubbly and roughly doubled when you mixed the dough?',
  ],
  ['user', 'It had a few bubbles, but I used it straight from the fridge.'],
  [
    'assistant',
    'That is the likely cause. A cold starter is sluggish. Feed it twice at room temperature, about 12 hours apart, and use it when it has doubled and smells pleasantly sour.',
  ],
  ['user', 'How do I know when the dough itself is ready to shape?'],
  [
    'assistant',
    'Look for a dough that has grown by about half, feels airy, and shows bubbles on the sides of the bowl. In a 24 °C kitchen that takes four to six hours.',
  ],
  ['user', 'And the final proof before baking?'],
  [
    'assistant',
    'Press the dough gently with a floured finger. If the dent springs back slowly and leaves a small mark, bake it. If it springs back at once, give it another 30 minutes.',
  ],
]

const messages = ref<ChatMessageData[]>(
  thread.map(([role, text], index) => toMessage({ id: String(index), role, text })),
)

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'dislike' }]

const replies: Record<string, string> = {
  'Why is my crumb so dense?':
    'A dense crumb comes from too little fermentation or too little strength. Give the dough three sets of stretch and folds in the first two hours, and let it rise until it has grown by half before you shape it.',
  'Can I bake it in a loaf tin?':
    'Yes. Grease the tin, shape the dough into a log, and let it rise until it crowns just above the rim. Bake at 220 °C for 40 minutes with a tray of hot water on the bottom shelf for the first 15.',
  'How do I keep my starter on holiday?':
    'Feed it, let it rise for an hour, then put it in the fridge with the lid on. It keeps for two to three weeks. When you are back, feed it twice at room temperature before you bake.',
}

const suggestions = ref<PromptSuggestionItem[]>([
  { label: 'Dense crumb', prompt: 'Why is my crumb so dense?' },
  { label: 'Loaf tin', prompt: 'Can I bake it in a loaf tin?' },
  { label: 'Starter on holiday', prompt: 'How do I keep my starter on holiday?' },
])

const status = ref<ChatStatus>('ready')
let timer: ReturnType<typeof setTimeout> | undefined

// The reply starts as an empty message, then grows a couple of words at a time.
const streamReply = (reply: string) => {
  const id = `reply-${messages.value.length}`
  const words = reply.split(' ')
  let count = 0

  messages.value = [...messages.value, { id, role: 'assistant', parts: [] }]
  status.value = 'streaming'

  const grow = () => {
    count += 2

    const partial = toMessage({ id, role: 'assistant', text: words.slice(0, count).join(' ') })

    messages.value = [...messages.value.slice(0, -1), partial]

    if (count < words.length) {
      timer = setTimeout(grow, 60)

      return
    }

    status.value = 'ready'
  }

  timer = setTimeout(grow, 900)
}

const send = (prompt: string) => {
  const id = `ask-${messages.value.length}`

  messages.value = [...messages.value, toMessage({ id, role: 'user', text: prompt })]
  suggestions.value = suggestions.value.filter((suggestion) => suggestion.prompt !== prompt)
  status.value = 'submitted'
  timer = setTimeout(() => streamReply(replies[prompt] ?? ''), 700)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
