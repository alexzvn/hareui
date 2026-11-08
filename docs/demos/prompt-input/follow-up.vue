<template>
  <div class="flex w-full max-w-xl flex-col gap-2">
    <PromptInput
      v-model="text"
      layout="compact"
      placeholder="Ask for a follow-up change"
      @submit="send"
    >
      <template #header>
        <Button size="sm" variant="outline">
          <Icon icon="gravity-ui:code-compare" />
          Review
          <span class="text-success">+128</span>
          <span class="text-danger">−12</span>
        </Button>
        <Button size="sm" variant="outline">
          <Icon icon="gravity-ui:code-pull-request" />
          Open pull request
        </Button>
        <Tooltip :delay="0" text="More actions">
          <Button aria-label="More actions" icon-only size="sm" variant="outline">
            <Icon icon="gravity-ui:ellipsis" />
          </Button>
        </Tooltip>
      </template>
    </PromptInput>
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-muted">
      <span class="flex items-center gap-1 whitespace-nowrap">
        <Icon icon="gravity-ui:code-fork" />
        fix/checkout-totals
      </span>
      <span class="flex items-center gap-1 whitespace-nowrap">
        <Icon icon="gravity-ui:cloud" />
        Staging
      </span>
      <span class="ms-auto flex items-center gap-1.5 whitespace-nowrap">
        <ProgressCircle aria-label="Context used" size="sm" :value="contextUsed" />
        {{ contextUsed }}% context used
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, ProgressCircle, PromptInput, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const text = ref('')
const contextUsed = ref(42)

const send = (prompt: string) => {
  console.log(prompt)
  text.value = ''
  contextUsed.value = Math.min(contextUsed.value + 6, 100)
}
</script>
