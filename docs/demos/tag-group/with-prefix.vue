<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TagGroupItem } from '@hareui/vue'
import { Avatar, TagGroup } from '@hareui/vue'

const icons: Record<string, string> = {
  news: 'gravity-ui:square-article',
  travel: 'gravity-ui:planet-earth',
  gaming: 'gravity-ui:rocket',
  shopping: 'gravity-ui:shopping-bag',
}
const iconItems: TagGroupItem[] = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
]
interface Person extends TagGroupItem {
  avatar: string
  fallback: string
}

const people: Person[] = [
  { id: 'fred', label: 'Fred', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', fallback: 'F' },
  { id: 'michael', label: 'Michael', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', fallback: 'M' },
  { id: 'jane', label: 'Jane', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', fallback: 'J' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <TagGroup selection-mode="single" label="With Icons" description="Tags with icons" :items="iconItems">
      <template #item="{ item }">
        <Icon :icon="icons[item.id]!" />
        {{ item.label }}
      </template>
    </TagGroup>
    <TagGroup selection-mode="single" label="With Avatars" description="Tags with avatars" :items="people">
      <template #item="{ item }">
        <Avatar class="size-4" :src="item.avatar" :fallback="item.fallback" />
        {{ item.label }}
      </template>
    </TagGroup>
  </div>
</template>
