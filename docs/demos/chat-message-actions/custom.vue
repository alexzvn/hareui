<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="max-w-lg">
    <template #actions>
      <ChatMessageActions :actions="actions" :message="message">
        <span class="ms-2 self-center text-xs text-muted">{{ status }}</span>
      </ChatMessageActions>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatMessageActions } from '@hareui/vue'
import { computed, onBeforeUnmount, shallowReactive } from 'vue'

const message: ChatMessageData = {
  id: 'museum',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'The city museum opens at 10:00 and closes at 18:00, except on Mondays. Entry is free on the first Sunday of the month.',
    },
  ],
}

const state = shallowReactive({ isReading: false, isSharing: false, status: '' })

let shareTimer: ReturnType<typeof setTimeout> | undefined

const share = () => {
  state.isSharing = true

  shareTimer = setTimeout(() => {
    state.isSharing = false
    state.status = 'Share link created'
  }, 1200)
}

const actions = computed<ChatMessageAction[]>(() => [
  { kind: 'copy', label: 'Copy answer' },
  {
    label: 'Read aloud',
    icon: 'icon-[gravity-ui--volume]',
    pressed: state.isReading,
    class: 'aria-pressed:text-accent',
    onClick: () => {
      state.isReading = !state.isReading
    },
  },
  {
    kind: 'share',
    icon: 'icon-[gravity-ui--arrow-up-from-square]',
    pending: state.isSharing,
    onClick: share,
  },
  {
    kind: 'more',
    items: [
      {
        value: 'markdown',
        label: 'Copy as Markdown',
        icon: 'icon-[gravity-ui--logo-markdown]',
        onSelect: () => {
          state.status = 'Copied as Markdown'
        },
      },
      {
        value: 'report',
        label: 'Report answer',
        icon: 'icon-[gravity-ui--flag]',
        variant: 'danger',
        onSelect: () => {
          state.status = 'Report sent'
        },
      },
    ],
  },
])

const status = computed(() => (state.isReading ? 'Reading aloud…' : state.status))

onBeforeUnmount(() => clearTimeout(shareTimer))
</script>
