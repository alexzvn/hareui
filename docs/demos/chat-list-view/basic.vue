<template>
  <div class="w-[480px] max-w-full">
    <ChatListView :items="threads" aria-label="Recent chats" />
  </div>
</template>

<script setup lang="ts">
import type { ChatListViewItem } from '@hareui/vue'
import { ChatListView } from '@hareui/vue'

const threads: ChatListViewItem[] = [
  {
    value: 'lisbon',
    label: 'Weekend in Lisbon',
    description: 'Which neighbourhood is best for a first visit?',
    meta: '9:41 AM',
  },
  {
    value: 'sourdough',
    label: 'Sourdough starter troubleshooting',
    description: 'My starter smells like nail polish after two days.',
    meta: 'Yesterday',
  },
  {
    value: 'report',
    label: 'Quarterly report outline',
    description: 'Turn these meeting notes into a one-page outline.',
    meta: 'Mon',
  },
]
</script>
