<template>
  <div
    class="flex h-[540px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border"
  >
    <ChatConversation
      :messages="messages"
      :status="status"
      :assistant="{ icon: 'icon-[gravity-ui--sparkles]' }"
      :ui="{ content: 'flex-1' }"
    >
      <template v-if="!messages.length" #default>
        <div class="flex flex-1 flex-col justify-center">
          <PromptSuggestion
            title="What are we cooking tonight?"
            description="Pick a starter or tell me what is in your fridge."
            :items="suggestions"
            @select="send"
          />
        </div>
      </template>
      <template #footer>
        <PromptInput
          v-model="text"
          :status="status"
          placeholder="Ask for a recipe"
          @submit="send"
          @stop="stop"
        />
      </template>
    </ChatConversation>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageData, ChatStatus, PromptSuggestionItem } from '@hareui/vue'
import { ChatConversation, PromptInput, PromptSuggestion } from '@hareui/vue'
import { onBeforeUnmount, ref } from 'vue'

const suggestions: PromptSuggestionItem[] = [
  {
    label: 'A 20-minute pasta',
    prompt: 'Give me a pasta I can make in 20 minutes.',
    icon: 'icon-[gravity-ui--clock]',
  },
  {
    label: 'Use up leftover rice',
    prompt: 'What can I make with leftover rice?',
    icon: 'icon-[gravity-ui--arrows-rotate-right]',
  },
  {
    label: 'Something without meat',
    prompt: 'Suggest a filling dinner without meat.',
    icon: 'icon-[gravity-ui--heart]',
  },
]

const replies: Record<string, string> = {
  'Give me a pasta I can make in 20 minutes.':
    'Try lemon and garlic spaghetti. Fry two sliced garlic cloves in olive oil, toss in the cooked pasta with lemon zest, a splash of pasta water and grated parmesan, then finish with black pepper.',
  'What can I make with leftover rice?':
    'Make egg fried rice. Fry spring onions and frozen peas, push them aside, scramble two eggs, then add the cold rice and a spoon of soy sauce. Day-old rice crisps up better than fresh.',
  'Suggest a filling dinner without meat.':
    'Roast a tray of chickpeas, sweet potato and red onion with cumin and paprika for 30 minutes. Serve it over couscous with a spoon of yoghurt and a handful of herbs.',
}

const fallback =
  'Tell me what is in your fridge and how much time you have, and I will suggest a dinner that fits.'

const messages = ref<ChatMessageData[]>([])
const text = ref('')
const status = ref<ChatStatus>('ready')
let timer: ReturnType<typeof setTimeout> | undefined

const setReply = (id: string, reply: string) => {
  messages.value = [
    ...messages.value.filter((message) => message.id !== id),
    { id, role: 'assistant', parts: reply ? [{ type: 'text', text: reply }] : [] },
  ]
}

// The reply grows a couple of words at a time after a short wait.
const streamReply = (id: string, reply: string) => {
  const words = reply.split(' ')
  let count = 0

  const grow = () => {
    count += 2
    setReply(id, words.slice(0, count).join(' '))

    if (count < words.length) {
      timer = setTimeout(grow, 60)

      return
    }

    status.value = 'ready'
  }

  setReply(id, '')
  status.value = 'streaming'
  timer = setTimeout(grow, 900)
}

const send = (prompt: string) => {
  const id = `ask-${messages.value.length}`

  messages.value = [
    ...messages.value,
    { id, role: 'user', parts: [{ type: 'text', text: prompt }] },
  ]

  text.value = ''
  status.value = 'submitted'
  timer = setTimeout(() => streamReply(`${id}-reply`, replies[prompt] ?? fallback), 600)
}

const stop = () => {
  clearTimeout(timer)
  messages.value = messages.value.filter((message) => message.parts.length)
  status.value = 'ready'
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
