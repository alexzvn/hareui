<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-muted">Primary</span>
      <PromptInput v-model="primary" placeholder="Ask anything" />
    </div>
    <div class="flex flex-col gap-2 rounded-3xl bg-surface p-4 shadow-surface">
      <span class="text-sm font-medium text-muted">Secondary, on a surface</span>
      <PromptInput v-model="secondary" variant="secondary" placeholder="Ask anything" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PromptInput } from '@hareui/vue'
import { ref } from 'vue'

const primary = ref('')
const secondary = ref('')
</script>
