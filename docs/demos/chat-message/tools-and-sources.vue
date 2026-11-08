<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg" />
</template>

<script setup lang="ts">
import type { ChatMessageData } from '@hareui/vue'
import { ChatMessage } from '@hareui/vue'

const message: ChatMessageData = {
  id: 'trains',
  role: 'assistant',
  parts: [
    {
      type: 'reasoning',
      text: 'The user wants the last train to Amsterdam tonight. I should check the timetable, then the service notices for engineering work.',
      state: 'done',
    },
    {
      type: 'tool-getTimetable',
      toolCallId: 'call-timetable',
      state: 'output-available',
      input: { from: 'Utrecht Centraal', to: 'Amsterdam Centraal', date: 'today' },
      output: { lastDeparture: '00:42', platform: 5, changes: 0 },
    },
    {
      type: 'text',
      text: 'The last direct train to Amsterdam leaves at 00:42 from platform 5. No engineering work is planned on the line tonight.',
    },
    {
      type: 'source-url',
      sourceId: 'timetable',
      url: 'https://example.com/timetables/utrecht-amsterdam',
      title: 'Night timetable',
    },
    {
      type: 'source-url',
      sourceId: 'notices',
      url: 'https://example.com/service-notices',
      title: 'Service notices',
    },
  ],
}
</script>
