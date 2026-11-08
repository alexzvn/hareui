<template>
  <div class="flex w-full max-w-3xl flex-col gap-4">
    <Switch v-model="isStreaming" label="Response in progress" />
    <PromptSuggestion :items="items" :disabled="isStreaming" />
  </div>
</template>

<script setup lang="ts">
import { PromptSuggestion, Switch } from '@hareui/vue'
import { ref } from 'vue'

const isStreaming = ref(true)

const items = [
  'Summarize this week in three bullet points',
  'Draft a reply to the design review thread',
  'Turn my meeting notes into action items',
  'Explain this error message in plain words',
]
</script>
