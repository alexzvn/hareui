<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Avatar, ListBox, Surface } from '@hareui/vue'
const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg' },
]
</script>

<template>
  <Surface class="w-[256px] rounded-3xl shadow-surface">
    <ListBox aria-label="Users" selection-mode="multiple" :items="users">
      <template #item-leading="{ item }">
        <Avatar size="sm" :alt="item.label" :src="(item as any).avatar" :fallback="item.label?.[0]" />
      </template>
      <template #indicator="{ selected }">
        <Icon v-if="selected" class="size-4 text-accent-soft-foreground" icon="gravity-ui:check" />
      </template>
    </ListBox>
  </Surface>
</template>
