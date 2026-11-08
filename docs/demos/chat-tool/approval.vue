<template>
  <div class="flex w-full max-w-lg flex-col items-start gap-3">
    <ChatMessage role="assistant" :parts="parts" icon="icon-[gravity-ui--sparkles]" class="w-full">
      <template #tool="{ part }">
        <ChatTool :part="part" @approve="answer(true)" @deny="answer(false)" />
      </template>
    </ChatMessage>
    <Button v-if="tool.state !== 'approval-requested'" size="sm" variant="secondary" @click="reset">
      Reset
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessagePart, ChatToolPart } from '@hareui/vue'
import { Button, ChatMessage, ChatTool } from '@hareui/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const request: ChatToolPart = {
  type: 'tool-sendEmail',
  toolCallId: 'call-email',
  state: 'approval-requested',
  input: { to: 'kitchen@example.com', subject: 'Menu for Monday' },
}

const tool = ref<ChatToolPart>({ ...request })

const parts = computed<ChatMessagePart[]>(() => [
  { type: 'text', text: "I've drafted the email to the kitchen. Should I send it?" },
  tool.value,
])

let timer: ReturnType<typeof setTimeout> | undefined

const answer = (isApproved: boolean) => {
  if (!isApproved) {
    tool.value = { ...tool.value, state: 'output-denied' }

    return
  }

  tool.value = { ...tool.value, state: 'approval-responded' }

  timer = setTimeout(() => {
    tool.value = {
      ...tool.value,
      state: 'output-available',
      output: { sent: true, id: 'msg_8f2c' },
    }
  }, 1500)
}

const reset = () => {
  clearTimeout(timer)
  tool.value = { ...request }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
