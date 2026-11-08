<template>
  <ChainOfThought :steps="steps" :duration="9" default-open class="max-w-md">
    <template #step-content="{ step }">
      <p>{{ step.content }}</p>
      <div v-if="step.label === 'Search'" class="mt-2 flex flex-wrap gap-1.5">
        <span
          v-for="site in sites"
          :key="site"
          class="rounded-full bg-default px-2 py-0.5 text-xs text-muted"
          >{{ site }}</span
        >
      </div>
    </template>
  </ChainOfThought>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep } from '@hareui/vue'
import { ChainOfThought } from '@hareui/vue'

const sites = ['vuejs.org', 'developer.mozilla.org', 'web.dev']

const steps: ChainOfThoughtStep[] = [
  { label: 'Search', content: 'Found three references on lazy loading routes.' },
  {
    label: 'Summarise',
    content: 'Dynamic imports split each route into its own chunk, loaded on first visit.',
  },
]
</script>
