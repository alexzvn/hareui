<template>
  <div class="flex w-full max-w-lg flex-col items-start gap-3">
    <ChatMessage role="assistant" :parts="parts" icon="icon-[gravity-ui--sparkles]" class="w-full">
      <template #tool="{ part }">
        <ChatTool :part="part" suffix="Google Sheets" default-open />
      </template>
    </ChatMessage>
    <Button size="sm" variant="secondary" :disabled="isRunning" @click="run">Run again</Button>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessagePart, ChatToolPart } from '@hareui/vue'
import { Button, ChatMessage, ChatTool } from '@hareui/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const args = { sheet: 'Budget', cell: 'B12', value: 1250 }
const argsText = JSON.stringify(args)

const start: ChatToolPart = {
  type: 'tool-updateSheet',
  toolCallId: 'call-sheet',
  state: 'input-streaming',
}

const tool = ref<ChatToolPart>({ ...start })

const parts = computed<ChatMessagePart[]>(() => [
  { type: 'text', text: "I'll add the March rent to your budget sheet." },
  tool.value,
])

const isRunning = computed(() => tool.value.state !== 'output-available')

let timer: ReturnType<typeof setTimeout> | undefined

const finish = () => {
  tool.value = { ...tool.value, state: 'input-available', input: args }

  timer = setTimeout(() => {
    tool.value = { ...tool.value, state: 'output-available', output: { updated: 'Budget!B12' } }
  }, 1200)
}

// The model writes the arguments a few characters at a time, as partial JSON text
const stream = (length: number) => {
  if (length >= argsText.length) {
    finish()

    return
  }

  tool.value = { ...tool.value, input: argsText.slice(0, length) }
  timer = setTimeout(() => stream(length + 3), 120)
}

const run = () => {
  clearTimeout(timer)
  tool.value = { ...start }
  stream(3)
}

run()
onBeforeUnmount(() => clearTimeout(timer))
</script>
