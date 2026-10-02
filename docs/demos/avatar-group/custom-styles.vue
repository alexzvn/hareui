<script setup lang="ts">
import { Avatar, AvatarGroup } from 'herouse'
import { Icon } from '@iconify/vue'

const assignees = [
  { id: 1, image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', name: 'John Doe' },
  { id: 2, image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', name: 'Kate Wilson' },
  { id: 3, image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', name: 'Emily Chen' },
] as const

const initials = (name: string) => name.split(' ').map(part => part[0]).join('')
</script>

<template>
  <div class="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-surface/95 py-1 pr-3 pl-1 shadow-sm ring-1 ring-black/[0.04] dark:border-border/80 dark:bg-surface/90 dark:ring-white/10">
    <AvatarGroup
      aria-label="Assignees"
      class="[--avatar-group-overlap:0.7rem] [--avatar-group-seam:2px]"
      overlap="clip"
      role="group"
      size="sm"
    >
      <Avatar v-for="user in assignees" :key="user.id" :alt="user.name" :fallback="initials(user.name)" :src="user.image" />
      <Avatar>
        <template #fallback>
          <Icon class="size-4 shrink-0" icon="gravity-ui:person" />
        </template>
      </Avatar>
      <template #count>+3</template>
    </AvatarGroup>
    <span class="text-sm font-medium text-foreground">Assignees</span>
  </div>
</template>
