<template>
  <Autocomplete
    v-model="selectedKey"
    clearable
    class="w-[256px]"
    label="User"
    placeholder="Select a user"
    :search="false"
    :items="users"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder || !selectedItems[0]">
        {{ text }}
      </template>
      <div v-else class="flex items-center gap-2">
        <Avatar
          class="size-4"
          size="sm"
          :src="selectedItems[0]!.avatarUrl"
          :fallback="selectedItems[0]!.fallback"
        />
        <span>{{ selectedItems[0]!.label }}</span>
      </div>
    </template>
    <template #item-leading="{ item }">
      <Avatar size="sm" :src="item.avatarUrl" :fallback="item.fallback" />
    </template>
    <template #empty> No results found </template>
  </Autocomplete>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete, Avatar } from '@hareui/vue'
import { ref } from 'vue'

type User = {
  avatarUrl: string
  fallback: string
} & ListBoxItem

const users: User[] = [
  {
    value: '1',
    label: 'Bob',
    description: 'bob@heroui.com',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
    fallback: 'B',
  },
  {
    value: '2',
    label: 'Fred',
    description: 'fred@heroui.com',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
    fallback: 'F',
  },
  {
    value: '3',
    label: 'Martha',
    description: 'martha@heroui.com',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
    fallback: 'M',
  },
  {
    value: '4',
    label: 'John',
    description: 'john@heroui.com',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg',
    fallback: 'J',
  },
  {
    value: '5',
    label: 'Jane',
    description: 'jane@heroui.com',
    avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg',
    fallback: 'J',
  },
]

const selectedKey = ref<string | null>(null)
</script>
