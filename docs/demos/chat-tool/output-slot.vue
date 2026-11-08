<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #tool="{ part }">
      <ChatTool :part="part" default-open>
        <template #output="{ output }">
          <ul class="flex flex-col gap-1">
            <li
              v-for="flight in output as Flight[]"
              :key="flight.code"
              class="grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-xl bg-surface-secondary px-3 py-2 text-sm"
            >
              <span class="min-w-0">
                <span class="block font-medium whitespace-nowrap tabular-nums">
                  {{ flight.departs }} → {{ flight.arrives }}
                </span>
                <span class="block truncate text-xs text-muted">
                  {{ flight.airline }} · {{ flight.code }}
                </span>
              </span>
              <span class="text-end">
                <span class="block font-medium tabular-nums">{{ flight.price }}</span>
                <span class="block text-xs whitespace-nowrap text-muted">{{
                  flight.duration
                }}</span>
              </span>
            </li>
          </ul>
        </template>
      </ChatTool>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatTool } from '@hareui/vue'

type Flight = {
  code: string
  airline: string
  departs: string
  arrives: string
  duration: string
  price: string
}

const flights: Flight[] = [
  {
    code: 'U2 7682',
    airline: 'easyJet',
    departs: '13:15',
    arrives: '16:40',
    duration: '2h 25m',
    price: '€54',
  },
  {
    code: 'TP 432',
    airline: 'TAP Air Portugal',
    departs: '07:40',
    arrives: '11:05',
    duration: '2h 25m',
    price: '€89',
  },
  {
    code: 'IB 3101',
    airline: 'Iberia',
    departs: '09:50',
    arrives: '15:35',
    duration: '1 stop · 4h 45m',
    price: '€112',
  },
]

const message: ChatMessageData = {
  id: 'flights',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Here are the cheapest flights from Lisbon to Paris on Friday.' },
    {
      type: 'tool-findFlights',
      toolCallId: 'call-flights',
      state: 'output-available',
      input: { from: 'LIS', to: 'CDG', date: '2026-11-13' },
      output: flights,
    },
  ],
}
</script>
