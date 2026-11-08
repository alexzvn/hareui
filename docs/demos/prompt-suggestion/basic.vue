<template>
  <div class="flex w-full max-w-3xl flex-col gap-6">
    <PromptSuggestion
      title="What do you want to work on?"
      description="Pick a starter or type your own request."
      :items="items"
      @select="(prompt) => (text = prompt)"
    />
    <PromptInput v-model="text" placeholder="Ask anything" @submit="text = ''" />
  </div>
</template>

<script setup lang="ts">
import type { PromptSuggestionItem } from '@hareui/vue'
import { PromptInput, PromptSuggestion } from '@hareui/vue'
import { ref } from 'vue'

const text = ref('')

const items: (PromptSuggestionItem | string)[] = [
  {
    label: 'Summarize this week',
    prompt: 'Summarize what I worked on this week in three bullet points.',
  },
  {
    label: 'Reply to the design review',
    prompt: 'Draft a friendly reply to the design review thread, agreeing to the spacing changes.',
  },
  'Turn my meeting notes into action items',
  'Explain this error message in plain words',
  'Suggest names for a new reading app',
  'Plan a two-day trip to the coast',
]
</script>
