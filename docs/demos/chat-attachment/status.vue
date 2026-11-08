<template>
  <ChatAttachmentGroup :items="items" removable />
</template>

<script setup lang="ts">
import type { ChatAttachmentProps } from '@hareui/vue'
import { ChatAttachmentGroup } from '@hareui/vue'

const items: ChatAttachmentProps[] = [
  {
    name: 'whiteboard.jpg',
    type: 'image/jpeg',
    url: 'https://picsum.photos/id/20/240/240',
    status: 'uploading',
  },
  { name: 'budget.xlsx', bytes: 98_304, status: 'uploading' },
  {
    name: 'roadmap.pdf',
    bytes: 1_258_291,
    status: 'error',
    description: 'Upload failed. Try again.',
  },
  { name: 'notes.md', bytes: 4_198 },
]
</script>
