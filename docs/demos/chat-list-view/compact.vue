<template>
  <ChatListView
    :items="threads"
    density="compact"
    aria-label="Recent chats"
    class="w-[280px] max-w-full"
  />
</template>

<script setup lang="ts">
import type { ChatListViewItem } from '@hareui/vue'
import { ChatListView } from '@hareui/vue'

const threads: ChatListViewItem[] = [
  { value: 'lisbon', label: 'Weekend in Lisbon' },
  { value: 'sourdough', label: 'Sourdough starter troubleshooting' },
  { value: 'report', label: 'Quarterly report outline' },
]
</script>
