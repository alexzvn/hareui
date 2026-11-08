<template>
  <div class="flex w-full max-w-2xl flex-col items-center gap-6 py-6">
    <h2 class="text-center text-2xl font-semibold tracking-tight text-foreground">
      What are we working on today?
    </h2>
    <PromptInput
      ref="composer"
      v-model="text"
      v-model:files="files"
      size="lg"
      placeholder="Ask anything"
      class="w-full shadow-surface"
      @submit="send"
    >
      <template #leading="{ open }">
        <Tooltip :delay="0" text="Add files">
          <Button aria-label="Add files" icon-only size="sm" variant="tertiary" @click="open">
            <Icon icon="gravity-ui:plus" />
          </Button>
        </Tooltip>
      </template>
      <template #trailing>
        <Tooltip :delay="0" text="Dictate">
          <Button aria-label="Dictate" icon-only size="sm" variant="ghost">
            <Icon icon="gravity-ui:microphone" />
          </Button>
        </Tooltip>
      </template>
    </PromptInput>
    <PromptSuggestion :items="suggestions" :trailing-icon="false" @select="fill" />
  </div>
</template>

<script setup lang="ts">
import type { PromptSuggestionItem } from '@hareui/vue'
import { Button, PromptInput, PromptSuggestion, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref, useTemplateRef } from 'vue'

const text = ref('')
const files = ref<File[]>([])
const composer = useTemplateRef('composer')

const suggestions: PromptSuggestionItem[] = [
  {
    label: 'Draft a product brief',
    prompt: 'Draft a one-page product brief for a shared grocery list app',
    icon: 'icon-[gravity-ui--file-text]',
  },
  {
    label: 'Explain a stack trace',
    prompt: 'Explain this stack trace and suggest where to look first:',
    icon: 'icon-[gravity-ui--code]',
  },
  {
    label: 'Plan a sprint',
    prompt: 'Plan a two-week sprint for a team of four from this backlog:',
    icon: 'icon-[gravity-ui--calendar]',
  },
  {
    label: 'Compare two contracts',
    prompt: 'Compare these two contracts and list the clauses that differ',
    icon: 'icon-[gravity-ui--copy]',
  },
]

// A suggestion fills the composer so it can be edited before sending
const fill = (prompt: string) => {
  text.value = prompt
  composer.value?.focus()
}

const send = (prompt: string, attached: File[]) => {
  console.log({ prompt, files: attached })
  text.value = ''
  files.value = []
}
</script>
