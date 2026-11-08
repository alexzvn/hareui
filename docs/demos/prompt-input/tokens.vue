<template>
  <div class="flex w-full max-w-xl flex-col gap-3">
    <PromptInputEditor
      v-model="text"
      v-model:files="files"
      :triggers="triggers"
      placeholder="Ask anything, @ to mention, / for commands"
      @submit="(prompt, _files, tokens) => send(prompt, tokens)"
    >
      <template #footer>Type @ to mention a teammate or / to run a command.</template>
    </PromptInputEditor>
    <div v-if="sentTokens.length" class="flex flex-wrap items-center gap-2 text-sm text-muted">
      Sent with
      <Chip
        v-for="token in sentTokens"
        :key="`${token.char}${token.id}`"
        :label="`${token.char}${token.label}`"
        size="sm"
        color="accent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chip } from '@hareui/vue'
import { PromptInputEditor } from '@hareui/vue/editor'
import type { PromptInputEditorToken, PromptInputEditorTrigger } from '@hareui/vue/editor'
import { ref } from 'vue'

const avatars = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars'

// Tokens in the text become tokens in the editor, so a draft can start with them
const text = ref('Ask @mira to check the onboarding copy, then /summarize the feedback')
const files = ref<File[]>([])
const sentTokens = ref<PromptInputEditorToken[]>([])

const triggers: PromptInputEditorTrigger[] = [
  {
    char: '@',
    items: [
      {
        id: 'u-mira',
        label: 'mira',
        description: 'Mira Castell',
        avatar: { src: `${avatars}/blue.jpg` },
      },
      {
        id: 'u-tomas',
        label: 'tomas',
        description: 'Tomás Reyes',
        avatar: { src: `${avatars}/green.jpg` },
      },
      {
        id: 'u-ines',
        label: 'ines',
        description: 'Inês Duarte',
        avatar: { src: `${avatars}/purple.jpg` },
      },
    ],
  },
  {
    char: '/',
    items: [
      {
        id: 'summarize',
        label: 'summarize',
        description: 'Summarize the thread',
        icon: 'icon-[gravity-ui--text-align-left]',
      },
      {
        id: 'browse',
        label: 'browse',
        description: 'Look it up on the web',
        icon: 'icon-[gravity-ui--globe]',
      },
      {
        id: 'search',
        label: 'search',
        description: 'Search the team’s documents',
        icon: 'icon-[gravity-ui--magnifier]',
      },
    ],
  },
]

const send = (prompt: string, tokens: PromptInputEditorToken[]) => {
  console.log({ prompt, tokens })
  sentTokens.value = tokens
  text.value = ''
  files.value = []
}
</script>
