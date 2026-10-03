<script setup lang="ts">
import { Autocomplete, Avatar } from 'herouse'
import { ref } from 'vue'

const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', fallback: 'B' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', fallback: 'F' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', fallback: 'M' },
  { value: '4', label: 'John', description: 'john@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg', fallback: 'J' },
  { value: '5', label: 'Jane', description: 'jane@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg', fallback: 'J' },
]
const userById = new Map(users.map(user => [user.value, user]))

const selectedKey = ref<string | null>(null)
</script>

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
      <template v-if="isPlaceholder || !userById.get(String(selectedItems[0]?.value))">
        {{ text }}
      </template>
      <div v-else class="flex items-center gap-2">
        <Avatar class="size-4" size="sm" :src="userById.get(String(selectedItems[0]!.value))!.avatarUrl" :fallback="userById.get(String(selectedItems[0]!.value))!.fallback" />
        <span>{{ selectedItems[0]!.label }}</span>
      </div>
    </template>
    <template #item-leading="{ item }">
      <Avatar size="sm" :src="userById.get(String(item.value))?.avatarUrl" :fallback="userById.get(String(item.value))?.fallback" />
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
