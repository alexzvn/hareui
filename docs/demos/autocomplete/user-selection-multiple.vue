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
      <TagGroup
        v-else
        size="sm"
        removable
        aria-label="Selected users"
        :items="
          selectedItems.map((item) => ({
            id: String(item.value),
            label: item.label,
            avatarUrl: item.avatarUrl,
            fallback: item.fallback,
          }))
        "
        @remove="onRemoveTags"
      >
        <template #item="{ item }">
          <Avatar class="size-4" size="sm" alt="" :src="item.avatarUrl" :fallback="item.fallback" />
          <span>{{ item.label }}</span>
        </template>
      </TagGroup>
    </template>
    <template #item-leading="{ item }">
      <Avatar size="sm" alt="" :src="item.avatarUrl" :fallback="item.fallback" />
    </template>
    <template #empty> No results found </template>
  </Autocomplete>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete, Avatar, TagGroup } from '@hareui/vue'
import { ref } from 'vue'

interface User extends ListBoxItem {
  avatarUrl: string
  fallback: string
}

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

const selectedKeys = ref<string[]>(['1', '2'])

function onRemoveTags(ids: string[]) {
  selectedKeys.value = selectedKeys.value.filter((key) => !ids.includes(key))
}
</script>
