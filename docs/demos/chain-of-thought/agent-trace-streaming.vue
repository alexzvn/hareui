<template>
  <div class="flex w-full max-w-lg flex-col items-start gap-3">
    <ChainOfThought
      :steps="shown"
      :streaming="isStreaming"
      :auto="{ closeDelay: 0 }"
      class="w-full"
    >
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
    <Button size="sm" variant="secondary" :disabled="isStreaming" @click="run">Run again</Button>
  </div>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep } from '@hareui/vue'
import { Button, Card, ChainOfThought } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

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

const STEP_MS = 1500

// The step being worked on: steps before it are done, later steps have not started yet
const current = ref(0)
const isStreaming = ref(false)

const shown = computed<ChainOfThoughtStep[]>(() =>
  steps.slice(0, current.value + 1).map((step, index) => ({
    ...step,
    status: isStreaming.value && index === current.value ? 'active' : 'done',
  })),
)

let timer: ReturnType<typeof setTimeout> | undefined

const next = () => {
  if (current.value === steps.length - 1) {
    isStreaming.value = false
    return
  }

  current.value += 1
  timer = setTimeout(next, STEP_MS)
}

const run = () => {
  clearTimeout(timer)
  current.value = 0
  isStreaming.value = true
  timer = setTimeout(next, STEP_MS)
}

run()
onBeforeUnmount(() => clearTimeout(timer))
</script>
