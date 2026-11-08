<template>
  <PromptSuggestion
    variant="card"
    title="Start from a template"
    description="Each card fills the prompt with a detailed request you can edit before sending."
    :items="items"
    class="max-w-4xl"
  />
</template>

<script setup lang="ts">
import type { PromptSuggestionItem } from '@hareui/vue'
import { PromptSuggestion } from '@hareui/vue'

const items: PromptSuggestionItem[] = [
  {
    label: 'Launch checklist',
    description: 'A step-by-step list for shipping a feature, from QA to the announcement.',
    prompt: 'Write a launch checklist for a new feature, grouped by week.',
    meta: '2 min',
    tags: ['Planning'],
  },
  {
    label: 'Customer interview guide',
    description: 'Open questions that get people talking about their workflow.',
    prompt: 'Draft ten open questions for a customer interview about onboarding.',
    meta: '3 min',
    tags: ['Research'],
  },
  {
    label: 'Release notes',
    description: 'Turn a list of merged changes into notes your users will read.',
    prompt: 'Turn these merged changes into short, friendly release notes.',
    meta: '1 min',
    tags: ['Writing'],
  },
]
</script>
