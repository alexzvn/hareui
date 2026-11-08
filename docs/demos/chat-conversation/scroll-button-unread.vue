<template>
  <div class="flex h-[360px] w-full max-w-2xl flex-col rounded-2xl border border-border">
    <ChatConversation
      ref="conversation"
      :messages="messages"
      :assistant="{ icon: 'icon-[gravity-ui--sparkles]' }"
      :should-scroll-to-bottom="false"
    >
      <template #scroll-button="{ visible, scrollToBottom }">
        <Button v-if="visible && unread" size="sm" class="shadow-surface" @click="showUnread">
          <span class="icon-[gravity-ui--arrow-down] size-4" />
          {{ unread }} new messages
        </Button>
        <Button
          v-else-if="visible"
          size="sm"
          variant="tertiary"
          class="shadow-surface"
          @click="scrollToBottom"
        >
          <span class="icon-[gravity-ui--arrow-down] size-4" />
          Back to latest
        </Button>
      </template>
    </ChatConversation>
  </div>
</template>

<script setup lang="ts">
import type { ChatConversationExposed, ChatMessageData, ChatRole } from '@hareui/vue'
import { Button, ChatConversation } from '@hareui/vue'
import { ref, useTemplateRef, watch } from 'vue'

const updates: [ChatRole, string][] = [
  ['assistant', 'I am watching fares from Lisbon to Oslo for 14 to 21 May. Today: €212 return.'],
  ['user', 'Tell me if it drops under €180.'],
  ['assistant', 'Will do. Monday: €208 return, still with the same two airlines.'],
  ['assistant', 'Tuesday: €215. Prices often rise mid-week, so no change to the plan.'],
  ['assistant', 'Wednesday: €199, the lowest since I started watching.'],
  ['user', 'Nice. Is there a direct flight at that price?'],
  ['assistant', 'Yes, the 07:40 departure is direct. The €199 fare has no checked bag.'],
  ['assistant', 'Thursday: €176 return on the direct flight. That is under your €180 limit.'],
  ['assistant', 'Two seats are left at this price. Want me to hold them for 24 hours?'],
]

const messages: ChatMessageData[] = updates.map(([role, text], index) => ({
  id: String(index),
  role,
  parts: [{ type: 'text', text }],
}))

// The last two updates arrived while you were away
const unread = ref(2)
const firstUnreadId = messages.at(-unread.value)?.id ?? ''

const conversation = useTemplateRef<ChatConversationExposed>('conversation')

const showUnread = () => {
  conversation.value?.scrollToMessage(firstUnreadId)
  unread.value = 0
}

// Reaching the bottom yourself marks the updates as read
watch(
  () => conversation.value?.isAtBottom,
  (isAtBottom, wasAtBottom) => {
    if (isAtBottom && wasAtBottom === false) unread.value = 0
  },
)
</script>
