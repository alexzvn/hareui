<template>
  <ListView :items="items" selectable multiple aria-label="Team members" class="max-w-md">
    <template #item-leading="{ item }">
      <Avatar :src="item.avatar" :alt="item.label" size="sm" />
    </template>
    <template #item-description="{ item }">
      <span class="flex items-center gap-1.5">
        {{ item.description }}
        <Chip v-if="item.owner" size="sm" variant="soft">Owner</Chip>
      </span>
    </template>
  </ListView>
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { Avatar, Chip, ListView } from '@hareui/vue'

type Member = ListViewItem & { avatar: string; owner?: boolean }

const items: Member[] = [
  {
    value: 'amara',
    label: 'Amara Okafor',
    description: 'amara@studio.dev',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=4',
    owner: true,
  },
  {
    value: 'lukas',
    label: 'Lukas Weber',
    description: 'lukas@studio.dev',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
  },
  {
    value: 'mei',
    label: 'Mei Tanaka',
    description: 'mei@studio.dev',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=6',
  },
]
</script>
