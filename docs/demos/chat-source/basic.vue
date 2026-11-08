<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <p class="text-sm leading-6">
        Vue compiles templates into render functions ahead of time
        <ChatSource :part="parts[0]" :favicon="favicon('vuejs.org')" />, and the browser runs them
        like any other module script
        <ChatSource :part="parts[1]" :favicon="favicon('developer.mozilla.org')" />.
      </p>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatSourceUrlPart } from '@hareui/vue'
import { ChatMessage, ChatSource } from '@hareui/vue'

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const parts: ChatSourceUrlPart[] = [
  {
    type: 'source-url',
    sourceId: 'vue',
    url: 'https://vuejs.org/guide/extras/rendering-mechanism',
    title: 'Rendering mechanism',
  },
  {
    type: 'source-url',
    sourceId: 'mdn',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
    title: 'JavaScript modules',
  },
]
</script>
