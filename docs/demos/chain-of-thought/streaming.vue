<template>
  <div class="flex w-full max-w-md flex-col items-start gap-3">
    <ChainOfThought :steps="shown" :streaming="isStreaming" class="w-full" />
    <Button size="sm" variant="secondary" :disabled="isStreaming" @click="run">Think again</Button>
  </div>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep } from '@hareui/vue'
import { Button, ChainOfThought } from '@hareui/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const steps: ChainOfThoughtStep[] = [
  { label: 'Search', content: 'Looking up opening hours for the three nearest bakeries.' },
  { label: 'Compare', content: 'Two close at 18:00, one stays open until 20:00 on weekdays.' },
  { label: 'Plan', content: 'Suggest the late one and mention the walk takes twelve minutes.' },
]

const STEP_MS = 1300

const count = ref(0)
const isStreaming = ref(false)
const shown = computed(() => steps.slice(0, count.value))

let timer: ReturnType<typeof setTimeout> | undefined

const next = () => {
  if (count.value === steps.length) {
    isStreaming.value = false
    return
  }

  count.value += 1
  timer = setTimeout(next, STEP_MS)
}

const run = () => {
  clearTimeout(timer)
  count.value = 0
  isStreaming.value = true
  timer = setTimeout(next, STEP_MS)
}

run()
onBeforeUnmount(() => clearTimeout(timer))
</script>
