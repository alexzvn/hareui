<template>
  <ChatListView :items="threads" aria-label="Shared chats" class="w-[480px] max-w-full">
    <template #item-leading="{ item }">
      <Avatar size="sm" :fallback="item.initials" />
    </template>
    <template #item-meta="{ item }">
      <Chip v-if="item.unread" size="sm" color="accent" :label="`${item.unread} new`" />
      <span v-else>{{ item.meta }}</span>
    </template>
  </ChatListView>
</template>

<script setup lang="ts">
import type { ChatListViewItem } from '@hareui/vue'
import { Avatar, ChatListView, Chip } from '@hareui/vue'

type SharedThread = ChatListViewItem & { initials: string; unread?: number }

const threads: SharedThread[] = [
  {
    value: 'roadmap',
    label: 'Q3 roadmap',
    description: 'Maya: Can we move the export work earlier?',
    meta: '10 min',
    initials: 'ML',
    unread: 3,
  },
  {
    value: 'hiring',
    label: 'Hiring loop',
    description: 'Jonas: The take-home brief is ready.',
    meta: '1h ago',
    initials: 'JB',
  },
  {
    value: 'offsite',
    label: 'Team offsite',
    description: 'Ana: Two venues left on the list.',
    meta: 'Tue',
    initials: 'AR',
  },
]
</script>
