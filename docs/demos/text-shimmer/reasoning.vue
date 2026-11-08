<template>
  <div class="flex w-full max-w-md flex-col items-start gap-3">
    <ChainOfThought :steps="shown" :streaming="isStreaming" class="w-full">
      <template #label="{ streaming, duration }">
        <TextShimmer v-if="streaming" class="flex items-center gap-2">
          <span class="icon-[gravity-ui--magnifier] size-4" />
          Comparing train and bus times
        </TextShimmer>
        <span v-else>Planned the route in {{ duration }} seconds</span>
      </template>
    </ChainOfThought>
    <Button size="sm" variant="secondary" :disabled="isStreaming" @click="run">Plan again</Button>
  </div>
</template>

<script setup lang="ts">
import type { ChainOfThoughtStep } from '@hareui/vue'
import { Button, ChainOfThought, TextShimmer } from '@hareui/vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const steps: ChainOfThoughtStep[] = [
  { label: 'Search', content: 'Found the 7:42 train and the 8:05 bus from Riverside.' },
  { label: 'Compare', content: 'The train takes 33 minutes, the bus about 35 with traffic.' },
  { label: 'Plan', content: 'Suggest the train and keep the bus as a backup.' },
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
