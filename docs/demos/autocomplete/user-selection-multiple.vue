<script setup lang="ts">
import { Autocomplete, Avatar, TagGroup } from 'herouse'
import { ref } from 'vue'

const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', fallback: 'B' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', fallback: 'F' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', fallback: 'M' },
  { value: '4', label: 'John', description: 'john@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg', fallback: 'J' },
  { value: '5', label: 'Jane', description: 'jane@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg', fallback: 'J' },
]
const userById = new Map(users.map(user => [user.value, user]))

const selectedKeys = ref<string[]>(['1', '2'])

function onRemoveTags(ids: string[]) {
  selectedKeys.value = selectedKeys.value.filter(key => !ids.includes(key))
}
</script>

<template>
  <Autocomplete
    v-model="selectedKeys"
    clearable
    class="w-[256px]"
    label="Users"
    placeholder="Select your teammates"
    selection-mode="multiple"
    :search="false"
    :items="users"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder">
        {{ text }}
      </template>
      <TagGroup v-else size="sm" removable aria-label="Selected users" :items="selectedItems.map(item => ({ id: String(item.value), label: item.label }))" @remove="onRemoveTags">
        <template #item="{ item }">
          <Avatar class="size-4" size="sm" :src="userById.get(item.id)?.avatarUrl" :fallback="userById.get(item.id)?.fallback" />
          <span>{{ item.label }}</span>
        </template>
      </TagGroup>
    </template>
    <template #item-leading="{ item }">
      <Avatar size="sm" :src="userById.get(String(item.value))?.avatarUrl" :fallback="userById.get(String(item.value))?.fallback" />
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
