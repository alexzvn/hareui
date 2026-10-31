<template>
  <EmptyState
    class="w-full max-w-[420px]"
    :avatar="{ src: 'https://i.pravatar.cc/96?img=47', alt: 'Ines Duarte' }"
    title="Ines is away"
    description="She is back on Monday. Leave a note and she will pick it up when she returns."
    :actions="[{ label: 'Leave a note', variant: 'secondary' }]"
  />
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
</script>
