<template>
  <div class="flex w-full max-w-xs flex-col gap-1 rounded-2xl border border-border p-3">
    <ChatMessage
      compact
      role="user"
      :parts="[{ type: 'text', text: 'How do I change my billing email?' }]"
    />
    <ChatMessage
      compact
      icon="icon-[gravity-ui--sparkles]"
      :parts="[
        {
          type: 'text',
          text: 'Open Settings, then Billing, and edit the email under Invoices. New invoices go to the new address.',
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ChatMessage } from '@hareui/vue'
</script>
