<template>
  <ChatMessage :message="message" icon="icon-[gravity-ui--sparkles]" class="w-full max-w-lg">
    <template #reasoning>
      <ChainOfThought :steps="steps" :duration="14" default-open>
        <template #step-content="{ step }">
          <ul v-if="step.label === 'Explored 2 files'" class="flex flex-col gap-1">
            <li v-for="file in files" :key="file.name" class="flex items-center gap-2">
              <Icon icon="gravity-ui:file" aria-hidden="true" class="size-3.5 shrink-0" />
              <span class="font-mono text-xs text-foreground">{{ file.name }}</span>
              <span class="text-xs">{{ file.lines }} lines</span>
            </li>
          </ul>
          <Card v-else-if="step.label === 'Generated chart'" class="mt-1 w-full max-w-64 gap-2 p-3">
            <p class="text-xs font-medium text-foreground">Monthly sales</p>
            <div
              class="flex h-20 items-end gap-1.5"
              aria-label="Bar chart, sales rising from January to June"
              role="img"
            >
              <div
                v-for="(bar, i) in bars"
                :key="i"
                class="flex-1 rounded-sm bg-accent"
                :style="{ height: `${bar}%` }"
              />
            </div>
          </Card>
          <template v-else>{{ step.content }}</template>
        </template>
      </ChainOfThought>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep, ChatMessageData } from '@hareui/vue'
import { Card, ChainOfThought, ChatMessage } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const steps: ChainOfThoughtStep[] = [
  {
    label: 'Planned the page',
    icon: 'icon-[gravity-ui--list-check]',
    content:
      'A revenue dashboard with one chart of monthly sales, read from the existing data file.',
  },
  { label: 'Explored 2 files', icon: 'icon-[gravity-ui--folder-open]' },
  { label: 'Generated chart', icon: 'icon-[gravity-ui--chart-column]' },
]

const files = [
  { name: 'data/sales.json', lines: 48 },
  { name: 'src/pages/Dashboard.vue', lines: 112 },
]

const bars = [42, 58, 51, 73, 66, 88]

const message: ChatMessageData = {
  id: 'dashboard',
  role: 'assistant',
  parts: [
    {
      type: 'reasoning',
      text: 'Plan the dashboard, read the sales data, then draw the chart.',
      state: 'done',
    },
    {
      type: 'text',
      text: 'The dashboard is ready: sales grew every month but April, peaking in June.',
    },
  ],
}
</script>
