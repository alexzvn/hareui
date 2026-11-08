<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <p class="text-sm leading-6">
        The James Webb telescope orbits the Sun near the second Lagrange point
        <ChatSource
          v-for="(citation, index) in citations"
          :key="citation.href"
          :href="citation.href"
          :title="citation.title"
          :description="citation.description"
          :class="index ? 'ms-1' : undefined"
        >
          <template #icon>
            <span
              class="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground"
            >
              {{ index + 1 }}
            </span>
          </template>
          {{ citation.publisher }} </ChatSource
        >, about 1.5 million km from Earth.
      </p>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatSourceItem } from '@hareui/vue'
import { ChatMessage, ChatSource } from '@hareui/vue'

const citations: (ChatSourceItem & { publisher: string })[] = [
  {
    href: 'https://science.nasa.gov/mission/webb/orbit/',
    title: 'Webb orbit',
    publisher: 'NASA',
    description: 'Webb circles the second Sun-Earth Lagrange point in a halo orbit.',
  },
  {
    href: 'https://www.esa.int/Science_Exploration/Space_Science/Webb/Webb_at_L2',
    title: 'Webb at L2',
    publisher: 'ESA',
    description: 'L2 sits about 1.5 million kilometres from Earth, away from the Sun.',
  },
]
</script>
