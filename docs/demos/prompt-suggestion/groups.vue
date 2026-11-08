<template>
  <div class="flex w-full max-w-4xl flex-col gap-6">
    <PromptSuggestion variant="card" :groups="groups" @select="(prompt) => (text = prompt)" />
    <PromptInput v-model="text" placeholder="Ask anything" @submit="text = ''" />
  </div>
</template>

<script setup lang="ts">
import type { PromptSuggestionGroup } from '@hareui/vue'
import { PromptInput, PromptSuggestion } from '@hareui/vue'
import { ref } from 'vue'

const text = ref('')

const groups: PromptSuggestionGroup[] = [
  {
    label: 'Write',
    description: 'Drafts you can polish.',
    items: [
      {
        label: 'Cover letter',
        description: 'Tailored to a job post you paste in.',
        prompt: 'Write a one-page cover letter for the job post below.',
      },
      {
        label: 'Product update',
        description: "A short email for this month's changes.",
        prompt: "Draft a short email announcing this month's product changes.",
      },
    ],
  },
  {
    label: 'Analyze',
    description: 'Make sense of numbers and feedback.',
    items: [
      {
        label: 'Survey themes',
        description: 'Group open answers into recurring themes.',
        prompt: 'Group these open survey answers into recurring themes, most common first.',
      },
      {
        label: 'Spreadsheet summary',
        description: 'Explain the trends in a table of results.',
        prompt: 'Explain the main trends in the table below in plain words.',
      },
      {
        label: 'Churn reasons',
        description: 'Sort cancellation notes by cause.',
        prompt: 'Sort these cancellation notes by cause and count each one.',
      },
    ],
  },
]
</script>
