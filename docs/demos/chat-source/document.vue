<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <div class="flex flex-col items-start gap-2 text-sm leading-6">
        <p>
          Revenue grew 12% in the third quarter, led by the enterprise plan, while churn held at
          2.1%.
        </p>
        <div class="flex flex-wrap gap-2">
          <ChatSource v-for="part in parts" :key="part.sourceId" :part="part" />
        </div>
      </div>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatSourceDocumentPart } from '@hareui/vue'
import { ChatMessage, ChatSource } from '@hareui/vue'

const parts: ChatSourceDocumentPart[] = [
  {
    type: 'source-document',
    sourceId: 'q3',
    mediaType: 'application/pdf',
    title: 'Q3 board report',
    filename: 'q3-board-report.pdf',
  },
  {
    type: 'source-document',
    sourceId: 'churn',
    mediaType: 'text/csv',
    title: '',
    filename: 'churn-by-plan.csv',
  },
]
</script>
