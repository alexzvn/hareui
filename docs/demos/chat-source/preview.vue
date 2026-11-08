<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <p class="text-sm leading-6">
        Postgres keeps old row versions around until vacuum removes them, so long transactions make
        tables bloat
        <ChatSource
          href="https://www.postgresql.org/docs/current/routine-vacuuming.html"
          title="Routine vacuuming"
          :favicon="favicon('postgresql.org')"
          description="Why VACUUM matters, how autovacuum decides when to run, and how to tune it for busy tables."
        />.
      </p>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import { ChatMessage, ChatSource } from '@hareui/vue'

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
</script>
