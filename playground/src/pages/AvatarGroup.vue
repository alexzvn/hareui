<script setup lang="ts">
import { Avatar, AvatarGroup } from '@hareui/vue'

const names = ['John Doe', 'Kate Wilson', 'Emily Chen', 'Michael Brown', 'Olivia Davis']
const initials = (name: string) => name.split(' ').map(n => n[0]).join('')
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">AvatarGroup</h1>

    <section v-for="size in sizes" :key="size">
      <h2 class="mb-2 text-sm font-medium text-muted">Size {{ size }}, max 3</h2>
      <AvatarGroup :max="3" :size="size">
        <Avatar v-for="name in names" :key="name" :fallback="initials(name)" />
      </AvatarGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Ring + #count</h2>
      <AvatarGroup color="accent" overlap="ring" variant="soft">
        <Avatar v-for="name in names.slice(0, 3)" :key="name" :fallback="initials(name)" />
        <template #count>+9</template>
      </AvatarGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Grid</h2>
      <AvatarGroup grid>
        <Avatar v-for="name in names" :key="name" :fallback="initials(name)" />
      </AvatarGroup>
    </section>
  </div>
</template>
