<template>
  <div
    class="flex h-[600px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border"
  >
    <ChatConversation
      :messages="messages"
      :status="status"
      :assistant="{ icon: 'icon-[gravity-ui--sparkles]', actions }"
    >
      <template #text="{ part }">
        <Markdown :value="part.text" :streaming="part.state === 'streaming'" />
      </template>
      <template #footer>
        <PromptInput
          v-model="text"
          :status="status"
          placeholder="Ask about your trip"
          @submit="send"
          @stop="stop"
        />
        <p class="mt-2 text-center text-xs text-muted">
          Opening hours and prices change. Check them before you book.
        </p>
      </template>
    </ChatConversation>
  </div>
</template>

<script setup lang="ts">
import type {
  ChatMessageAction,
  ChatMessageData,
  ChatMessagePart,
  ChatStatus,
  ChatToolPart,
} from '@hareui/vue'
import { ChatConversation, PromptInput } from '@hareui/vue'
import { Markdown } from '@hareui/vue/markdown'
import { onBeforeUnmount, ref } from 'vue'

const messages = ref<ChatMessageData[]>([
  {
    id: 'plan',
    role: 'user',
    parts: [
      {
        type: 'text',
        text: 'Plan three days in Kyoto for the first week of April. We love food and quiet temples, and we would rather skip the crowds.',
      },
    ],
  },
  {
    id: 'plan-reply',
    role: 'assistant',
    parts: [
      {
        type: 'reasoning',
        text: 'Early April is cherry blossom season, so the famous spots are busy by 9 am. Plan the popular temples for early mornings, put the quieter northern temples in the afternoons, and keep the evenings for food.',
        state: 'done',
      },
      {
        type: 'tool-getForecast',
        toolCallId: 'call-forecast',
        state: 'output-available',
        input: { city: 'Kyoto', from: '2026-04-01', days: 3 },
        output: { high: '17 °C', low: '7 °C', rain: 'Light showers on day 2' },
      },
      {
        type: 'text',
        text: `Here is a plan that keeps you a step ahead of the crowds.

### Day 1: Higashiyama
- **7:30** Kiyomizu-dera before the tour buses arrive
- **11:00** Walk the Sannenzaka and Ninenzaka lanes
- **18:00** Dinner around Gion

### Day 2: Northern temples
Light showers are likely, and these gardens look best in the rain.
- **9:00** Ginkaku-ji and the Philosopher's Path
- **14:00** Shisen-do, a small hermitage garden that stays calm

### Day 3: Arashiyama
- **7:00** The bamboo grove, then Tenryu-ji when it opens
- **12:00** Tofu lunch near the temple

Pack a light jacket: mornings are around 7 °C.`,
        state: 'done',
      },
    ],
  },
])

const actions: ChatMessageAction[] = [{ kind: 'copy' }, { kind: 'like' }, { kind: 'dislike' }]

const reasoning =
  'They want dinner near Gion on the first evening. Look for small places that take bookings, so they do not queue after a long day.'

const answer = `Three places within a short walk of Gion:

| Place | Food | Price |
| --- | --- | --- |
| **Hanamikoji Kaiseki** | Seasonal set menu | ¥¥¥ |
| **Yasaka Udon** | Hand-cut udon | ¥ |
| **Shirakawa Yakitori** | Grilled skewers by the canal | ¥¥ |

Book Hanamikoji Kaiseki two weeks ahead. The other two take walk-ins before 18:00.`

const text = ref('Where should we eat near Gion on the first night?')
const status = ref<ChatStatus>('ready')
let timer: ReturnType<typeof setTimeout> | undefined

type Frame = { parts: ChatMessagePart[]; delay: number }

const slices = (value: string, size: number) =>
  Array.from({ length: Math.ceil(value.length / size) }, (_, index) =>
    value.slice(0, (index + 1) * size),
  )

// Every step of the reply as it would arrive: reasoning, then a restaurant search, then the answer.
const createFrames = (prompt: string): Frame[] => {
  const search: ChatToolPart = {
    type: 'tool-searchRestaurants',
    toolCallId: `call-${messages.value.length}`,
    state: 'input-available',
    input: { query: prompt, area: 'Gion, Kyoto' },
  }

  const thought: ChatMessagePart = { type: 'reasoning', text: reasoning, state: 'done' }

  const found: ChatToolPart = {
    ...search,
    state: 'output-available',
    output: { results: 3, open: 'Tonight from 17:00' },
  }

  return [
    ...slices(reasoning, 6).map((chunk) => ({
      parts: [{ type: 'reasoning', text: chunk, state: 'streaming' } as const],
      delay: 40,
    })),
    { parts: [thought, search], delay: 1200 },
    ...slices(answer, 4).map((chunk) => ({
      parts: [thought, found, { type: 'text', text: chunk, state: 'streaming' } as const],
      delay: 20,
    })),
    { parts: [thought, found, { type: 'text', text: answer, state: 'done' }], delay: 0 },
  ]
}

const setReplyParts = (parts: ChatMessagePart[]) => {
  const reply = messages.value.at(-1)

  if (reply?.role !== 'assistant') return

  messages.value = [...messages.value.slice(0, -1), { ...reply, parts }]
}

const play = (frames: Frame[]) => {
  const [frame, ...rest] = frames

  if (!frame) {
    status.value = 'ready'

    return
  }

  setReplyParts(frame.parts)
  timer = setTimeout(() => play(rest), frame.delay)
}

const send = (prompt: string) => {
  const id = `ask-${messages.value.length}`
  const frames = createFrames(prompt)

  messages.value = [
    ...messages.value,
    { id, role: 'user', parts: [{ type: 'text', text: prompt }] },
  ]

  text.value = ''
  status.value = 'submitted'

  timer = setTimeout(() => {
    messages.value = [...messages.value, { id: `${id}-reply`, role: 'assistant', parts: [] }]
    status.value = 'streaming'
    play(frames)
  }, 800)
}

// Stopping keeps what has arrived so far, and marks an unfinished search as stopped.
const finishPart = (part: ChatMessagePart): ChatMessagePart => {
  if (part.type === 'reasoning' || part.type === 'text') return { ...part, state: 'done' }

  if ('toolCallId' in part && part.state !== 'output-available') {
    return { ...part, state: 'output-error', errorText: 'Stopped before the search finished.' }
  }

  return part
}

const stop = () => {
  clearTimeout(timer)
  setReplyParts(messages.value.at(-1)?.parts.map(finishPart) ?? [])
  status.value = 'ready'
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
