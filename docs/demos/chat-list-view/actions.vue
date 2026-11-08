<template>
  <div class="w-[480px] max-w-full">
    <ChatListView
      :items="list"
      aria-label="Recent chats"
      @action="(value) => (last = `Open ${value}`)"
    >
      <template #item-action="{ item }">
        <Dropdown :items="menu" @action="(action) => onMenu(item, action)">
          <Button
            icon-only
            size="sm"
            variant="ghost"
            :aria-label="`More actions for ${item.label}`"
          >
            <span class="icon-[gravity-ui--ellipsis] size-4" aria-hidden="true" />
          </Button>
        </Dropdown>
      </template>
      <template #empty>No chats yet</template>
    </ChatListView>
    <p class="mt-3 text-sm text-muted">Last action: {{ last ?? 'none' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ChatListViewItem, DropdownEntry, DropdownValue } from '@hareui/vue'
import { Button, ChatListView, Dropdown } from '@hareui/vue'
import { ref } from 'vue'

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

const menu: DropdownEntry[] = [
  { value: 'rename', label: 'Rename' },
  { value: 'pin', label: 'Pin' },
  { value: 'delete', label: 'Delete', variant: 'danger' },
]

const list = ref(threads)
const last = ref<string>()

const onMenu = (item: ChatListViewItem, action: DropdownValue) => {
  last.value = `${String(action)} ${item.label}`

  if (action === 'delete') list.value = list.value.filter((thread) => thread.value !== item.value)
}
</script>
