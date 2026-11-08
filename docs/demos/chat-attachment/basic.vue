<template>
  <ChatAttachmentGroup :items="items" />
</template>

<script setup lang="ts">
import type { ChatAttachmentProps } from '@hareui/vue'
import { ChatAttachmentGroup } from '@hareui/vue'

const items: ChatAttachmentProps[] = [
  { name: 'whiteboard.jpg', type: 'image/jpeg', url: 'https://picsum.photos/id/20/240/240' },
  { name: 'kickoff.jpg', type: 'image/jpeg', url: 'https://picsum.photos/id/7/240/240' },
  { name: 'roadmap.pdf', type: 'application/pdf', bytes: 1_258_291 },
  { name: 'budget.xlsx', bytes: 98_304 },
  { name: 'notes.md', type: 'text/markdown', bytes: 4_198 },
]
</script>
