<template>
  <EmptyState
    class="w-full max-w-[420px]"
    title="Your team has no tasks"
    description="Assign a task to get everyone moving."
  >
    <template #leading>
      <AvatarGroup>
        <Avatar v-for="person in people" :key="person.src" :src="person.src" :alt="person.name" />
      </AvatarGroup>
    </template>
  </EmptyState>
</template>

<script setup lang="ts">
import { Avatar, AvatarGroup, EmptyState } from '@hareui/vue'

const people = [
  { name: 'Theo Marsh', src: 'https://i.pravatar.cc/96?img=12' },
  { name: 'Ada Kline', src: 'https://i.pravatar.cc/96?img=25' },
  { name: 'Ravi Patel', src: 'https://i.pravatar.cc/96?img=53' },
]
</script>
