<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatTool v-for="part in parts" :key="part.toolCallId" :part="part" :default-open="false" />
  </div>
</template>

<script setup lang="ts">
import type { ChatToolPart } from '@hareui/vue'
import { ChatTool } from '@hareui/vue'

const parts: ChatToolPart[] = [
  {
    type: 'tool-searchFlights',
    toolCallId: 'streaming',
    state: 'input-streaming',
    input: '{"from": "LIS", "to": "C',
  },
  {
    type: 'tool-createInvoice',
    toolCallId: 'available',
    state: 'input-available',
    input: { client: 'Northwind Bakery', amount: 1240 },
  },
  {
    type: 'tool-transferFunds',
    toolCallId: 'approval',
    state: 'approval-requested',
    input: { amount: 250, to: 'Savings' },
  },
  {
    type: 'tool-archiveProject',
    toolCallId: 'responded',
    state: 'approval-responded',
    input: { project: 'Website 2025' },
  },
  {
    type: 'tool-convertCurrency',
    toolCallId: 'output',
    state: 'output-available',
    input: { amount: 100, from: 'EUR', to: 'JPY' },
    output: { result: 17_320, rate: 173.2 },
  },
  {
    type: 'tool-fetchPage',
    toolCallId: 'error',
    state: 'output-error',
    input: { url: 'https://example.com/changelog' },
    errorText: 'The page took longer than 10 seconds to respond.',
  },
  {
    type: 'tool-deleteBranch',
    toolCallId: 'denied',
    state: 'output-denied',
    input: { branch: 'feature/old-checkout' },
  },
]
</script>
