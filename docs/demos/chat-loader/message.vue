<template>
  <div class="flex w-full max-w-lg flex-col gap-2">
    <ChatMessage
      role="user"
      :parts="[{ type: 'text', text: 'Which houseplants cope with a north-facing window?' }]"
    />
    <ChatMessage role="assistant" icon="icon-[gravity-ui--sparkles]">
      <template #content>
        <div class="flex items-start gap-2">
          <TextShimmer text="Finding plants for low light…" />
          <ChatLoader label="Finding plants for low light" />
        </div>
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import { ChatLoader, ChatMessage, TextShimmer } from '@hareui/vue'
</script>
