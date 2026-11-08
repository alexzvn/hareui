<template>
  <ChatMessage role="assistant" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #content>
      <p>I looked through the chip component and ran its tests.</p>
      <ChatToolGroup :parts="parts" :default-open="hasFailure" />
      <p>
        One test fails: Backspace no longer removes a chip. The key handler checks for "Delete"
        only.
      </p>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatToolPart } from '@hareui/vue'
import { ChatMessage, ChatToolGroup } from '@hareui/vue'

const parts: ChatToolPart[] = [
  {
    type: 'tool-listFiles',
    toolCallId: 'list',
    state: 'output-available',
    input: { path: 'src/components/chip' },
    output: ['Chip.vue', 'Chip.types.ts', 'theme.ts'],
  },
  {
    type: 'tool-readFile',
    toolCallId: 'read',
    state: 'output-available',
    input: { path: 'src/components/chip/Chip.vue' },
    output: { lines: 128, language: 'vue' },
  },
  {
    type: 'tool-runTests',
    toolCallId: 'test',
    state: 'output-error',
    input: { filter: 'chip' },
    errorText: '1 of 14 tests failed: chip › removes on Backspace',
  },
]

// Open the group when a call failed, so the error is in view
const hasFailure = parts.some((part) => part.state === 'output-error')
</script>
