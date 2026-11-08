<template>
  <PromptSuggestion :items="items" :trailing-icon="false" class="max-w-3xl" />
</template>

<script setup lang="ts">
import type { PromptSuggestionItem } from '@hareui/vue'
import { PromptSuggestion } from '@hareui/vue'

const items: PromptSuggestionItem[] = [
  { label: 'Write a short story', icon: 'icon-[gravity-ui--pencil]' },
  { label: 'Analyze a chart', icon: 'icon-[gravity-ui--chart-column]' },
  { label: 'Fix a bug in my code', icon: 'icon-[gravity-ui--code]' },
  { label: 'Translate a paragraph', icon: 'icon-[gravity-ui--globe]' },
]
</script>
