<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #tool="{ part }">
      <ChatTool :part="part" />
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage, ChatTool } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'weather',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Let me check the weather in Lisbon.' },
    {
      type: 'tool-getWeather',
      toolCallId: 'call-weather',
      state: 'output-available',
      input: { city: 'Lisbon' },
      output: { temperature: 18, condition: 'Partly cloudy', wind: '12 km/h N', rain: 0.1 },
    },
    { type: 'text', text: "It's 18 °C and partly cloudy, so a light jacket will do." },
  ],
}
</script>
