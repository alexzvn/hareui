<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <div class="flex flex-col items-start gap-2 text-sm leading-6">
        <p>
          The Rust compiler only lets one mutable reference to a value exist at a time, which rules
          out data races at compile time.
        </p>
        <ChatSource
          href="https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"
          :favicon="favicon('rust-lang.org')"
        />
      </div>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import { ChatMessage, ChatSource } from '@hareui/vue'

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
</script>
