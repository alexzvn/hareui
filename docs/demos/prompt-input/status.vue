<template>
  <div class="flex w-full max-w-xl flex-col gap-3">
    <PromptInput v-model="text" :status @submit="send" @stop="stop">
      <template #header>
        <Chip
          :color="chips[status].color"
          :label="chips[status].label"
          size="sm"
          class="self-start"
        >
          <template #leading><Icon height="16" icon="gravity-ui:circle-fill" width="6" /></template>
        </Chip>
      </template>
    </PromptInput>
    <Switch v-model="shouldFail" label="Simulate a network error" />
  </div>
</template>

<script setup lang="ts">
import type { ChatStatus, ChipProps } from '@hareui/vue'
import { Chip, PromptInput, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, ref } from 'vue'

const text = ref('Summarize the release notes')
const status = ref<ChatStatus>('ready')
const shouldFail = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const chips = {
  ready: { label: 'Ready', color: 'default' },
  submitted: { label: 'Waiting for the first token', color: 'accent' },
  streaming: { label: 'Streaming the answer', color: 'success' },
  error: { label: 'Request failed, press send to retry', color: 'danger' },
} as const satisfies Record<ChatStatus, { label: string; color: ChipProps['color'] }>

// The request waits a second for its first token, then streams for three. A failed one puts the prompt back.
const send = (prompt: string) => {
  text.value = ''
  status.value = 'submitted'

  timer = setTimeout(() => {
    if (shouldFail.value) {
      text.value = prompt
      status.value = 'error'

      return
    }

    status.value = 'streaming'
    timer = setTimeout(stop, 3000)
  }, 1000)
}

const stop = () => {
  clearTimeout(timer)
  status.value = 'ready'
}

onBeforeUnmount(() => clearTimeout(timer))
</script>
