<template>
  <div class="w-[480px] max-w-full">
    <ChatListView v-model="openThread" :items="threads" selectable aria-label="Recent chats" />
    <p class="mt-3 text-sm text-muted">Open thread: {{ openThread }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ChatListViewItem, ListViewValue } from '@hareui/vue'
import { ChatListView } from '@hareui/vue'
import { ref } from 'vue'

const threads: ChatListViewItem[] = [
  {
    value: 'bike',
    label: 'Commuter bike under $800',
    description: 'Compare a hybrid and a gravel bike for a 12 km ride.',
    meta: '11:02 AM',
  },
  {
    value: 'tomatoes',
    label: 'Balcony tomato watering schedule',
    description: 'How often in a heatwave, and morning or evening?',
    meta: 'Yesterday',
  },
  {
    value: 'sql',
    label: 'Slow SQL query on orders table',
    description: 'The join takes 4 seconds on 2 million rows.',
    meta: 'Fri',
  },
]

const openThread = ref<ListViewValue | null>('tomatoes')
</script>
