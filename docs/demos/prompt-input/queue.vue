<template>
  <div class="flex w-full max-w-xl flex-col gap-3">
    <TextShimmer
      v-if="status === 'streaming'"
      :text="`Answering · ${current}`"
      class="px-1 text-sm text-foreground"
    />
    <p v-else class="px-1 text-sm text-muted">Ready for the next prompt</p>
    <PromptInput
      v-model="text"
      v-model:queue="queue"
      :status
      placeholder="Send follow-ups while the answer streams"
      @submit="send"
      @stop="next"
      @send="next"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChatStatus, PromptInputQueueItem } from '@hareui/vue'
import { PromptInput, TextShimmer } from '@hareui/vue'
import { ref } from 'vue'

const text = ref('')
const status = ref<ChatStatus>('streaming')
const current = ref('Plan a three-day trip to Lisbon')

const queue = ref<PromptInputQueueItem[]>([
  { id: 'sintra', text: 'Add a day trip to Sintra' },
  {
    id: 'flights',
    text: 'Fit it around these flight times',
    files: [new File([new Uint8Array(86_000)], 'boarding-pass.pdf', { type: 'application/pdf' })],
  },
  { id: 'budget', text: 'Keep it under 600 euros' },
])

// The answer streams until you stop it. Stopping, or sending a queued prompt now, starts the first queued prompt.
const next = () => {
  const [item, ...rest] = queue.value

  if (!item) {
    status.value = 'ready'

    return
  }

  queue.value = rest
  current.value = item.text
  status.value = 'streaming'
}

const send = (prompt: string) => {
  text.value = ''
  current.value = prompt
  status.value = 'streaming'
}
</script>
