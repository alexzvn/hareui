<template>
  <aside class="flex w-[280px] max-w-full flex-col gap-3">
    <div class="flex items-center justify-between ps-4">
      <h3 class="text-sm font-semibold">Chats</h3>
      <Button icon-only size="sm" variant="ghost" aria-label="New chat" @click="onNewChat">
        <span class="icon-[gravity-ui--pencil-to-square] size-4" aria-hidden="true" />
      </Button>
    </div>
    <SearchField v-model="query" full-width placeholder="Search chats" aria-label="Search chats" />
    <section v-for="group in groups" :key="group.label" class="flex flex-col gap-1">
      <p :id="`${id}-${group.label}`" class="ps-4 text-xs font-medium text-muted">
        {{ group.label }}
      </p>
      <ChatListView
        v-model="activeThread"
        :items="group.items"
        density="compact"
        selectable
        :aria-labelledby="`${id}-${group.label}`"
      />
    </section>
    <p v-if="groups.length === 0" class="px-2 py-4 text-center text-sm text-muted">
      No chats match “{{ query }}”
    </p>
  </aside>
</template>

<script setup lang="ts">
import type { ChatListViewItem, ListViewValue } from '@hareui/vue'
import { Button, ChatListView, SearchField } from '@hareui/vue'
import { computed, ref, useId } from 'vue'

type Thread = ChatListViewItem & { day: 'Today' | 'Earlier' }

const threads = ref<Thread[]>([
  { value: 'lisbon', label: 'Weekend in Lisbon', day: 'Today' },
  { value: 'sourdough', label: 'Sourdough starter troubleshooting', day: 'Today' },
  { value: 'report', label: 'Quarterly report outline', day: 'Today' },
  { value: 'bike', label: 'Commuter bike under $800', day: 'Earlier' },
  { value: 'tomatoes', label: 'Balcony tomato watering schedule', day: 'Earlier' },
  { value: 'sql', label: 'Slow SQL query on orders table', day: 'Earlier' },
  { value: 'toast', label: 'Best man toast ideas', day: 'Earlier' },
])

const query = ref('')

const id = useId()

// Both lists bind the same ref: a thread value exists in one list only, so picking a row in one
// list leaves the other with no selected row.
const activeThread = ref<ListViewValue | null>('sourdough')

const groups = computed(() => {
  const search = query.value.trim().toLowerCase()
  const matches = threads.value.filter((thread) => thread.label.toLowerCase().includes(search))

  return (['Today', 'Earlier'] as const)
    .map((day) => ({ label: day, items: matches.filter((thread) => thread.day === day) }))
    .filter((group) => group.items.length > 0)
})

let newChats = 0

const onNewChat = () => {
  newChats += 1

  const value = `new-${newChats}`
  threads.value = [{ value, label: 'New chat', day: 'Today' }, ...threads.value]
  query.value = ''
  activeThread.value = value
}
</script>
