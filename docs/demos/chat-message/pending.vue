<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage
      role="user"
      :parts="[{ type: 'text', text: 'When is the last train to Amsterdam tonight?' }]"
    />
    <ChatMessage icon="icon-[gravity-ui--sparkles]">
      <template #content>
        <TextShimmer text="Checking the timetable…" class="text-muted" />
        <ChatLoader label="Checking the timetable" />
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import { ChatLoader, ChatMessage, TextShimmer } from '@hareui/vue'
</script>
