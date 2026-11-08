<template>
  <ChatAttachmentGroup :items="items" removable class="max-w-2xl" @remove="remove" />
</template>

<script setup lang="ts">
import type { ChatAttachmentProps } from '@hareui/vue'
import { ChatAttachmentGroup } from '@hareui/vue'
import { ref } from 'vue'

const items = ref<ChatAttachmentProps[]>([
  { name: 'q3-roadmap-final-v4.pdf', bytes: 1_258_291 },
  { name: 'marketing-budget-q3.xlsx', bytes: 98_304 },
  { name: 'offsite-agenda-september.docx', bytes: 52_429 },
  { name: 'pricing-experiments.csv', bytes: 18_842 },
  { name: 'usage-export-august.json', bytes: 734_003 },
  { name: 'launch-checklist.md', bytes: 3_174 },
  { name: 'brand-refresh-assets.zip', bytes: 24_536_678 },
  { name: 'all-hands-recording.mp4', bytes: 187_695_104 },
])

const remove = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index)
}
</script>
