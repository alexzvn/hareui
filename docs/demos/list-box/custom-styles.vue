<script setup lang="ts">
import { Avatar, ListBox } from 'herouse'
const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg' },
]
</script>

<template>
  <ListBox
    aria-label="Assignee"
    class="w-56 rounded-xl border border-border/80 bg-surface p-1 shadow-sm"
    :items="users.slice(0, 2)"
    :ui="{ item: 'rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/5' }"
  >
    <template #item-leading="{ item }">
      <Avatar size="sm" :alt="item.label" :src="(item as any).avatar" :fallback="item.label?.[0]" />
    </template>
  </ListBox>
</template>
