<script setup lang="ts">
import { Avatar, EmptyState, TagGroup } from 'herouse'
import { computed, ref } from 'vue'

interface User {
  id: string
  label: string
  avatar: string
  fallback: string
}

const users = ref<User[]>([
  { id: 'fred', label: 'Fred', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', fallback: 'F' },
  { id: 'michael', label: 'Michael', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', fallback: 'M' },
  { id: 'jane', label: 'Jane', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', fallback: 'J' },
  { id: 'alice', label: 'Alice', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg', fallback: 'A' },
  { id: 'bob', label: 'Bob', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg', fallback: 'B' },
  { id: 'charlie', label: 'Charlie', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/black.jpg', fallback: 'C' },
])
const selected = ref<string[]>(['fred', 'michael'])

const selectedUsers = computed(() => selected.value
  .map(id => users.value.find(user => user.id === id))
  .filter((user): user is User => !!user))

function onRemove(ids: string[]) {
  users.value = users.value.filter(user => !ids.includes(user.id))
  selected.value = selected.value.filter(id => !ids.includes(id))
}
</script>

<template>
  <div class="w-sm">
    <TagGroup
      v-model:selected="selected"
      selection-mode="multiple"
      removable
      label="Team Members"
      description="Select team members for your project"
      :items="users"
      @remove="onRemove"
    >
      <template #item="{ item }">
        <Avatar class="size-4" size="sm" :src="(item as User).avatar" :fallback="(item as User).fallback" />
        {{ item.label }}
      </template>
      <template #empty>
        <EmptyState class="p-1">
          No team members
        </EmptyState>
      </template>
    </TagGroup>
    <div v-if="selectedUsers.length > 0" class="mt-4 flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Selected:
      </p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="user in selectedUsers"
          :key="`${user.id}-selected`"
          class="flex items-center gap-2 rounded-lg bg-surface-tertiary px-2 py-1"
        >
          <Avatar class="size-4" size="sm" :src="user.avatar" :fallback="user.fallback" />
          <span class="text-sm">{{ user.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
