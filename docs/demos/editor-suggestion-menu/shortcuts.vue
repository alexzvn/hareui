<template>
  <Editor v-model="content" aria-label="Project brief" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorSuggestionMenu :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
import type { EditorSuggestionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Project brief: offline mode</h2>
<p>Field teams lose signal on site. The app should keep every form they fill in and send it once they're back online.</p>
<p></p>`)

const items: EditorSuggestionMenuItem[] = [
  {
    kind: 'heading',
    level: 2,
    label: 'Heading',
    description: 'Section heading',
    icon: 'icon-[gravity-ui--heading-2]',
    kbd: { content: '##' },
  },
  {
    kind: 'bulletList',
    label: 'Bullet list',
    description: 'Points in no order',
    icon: 'icon-[gravity-ui--list-ul]',
    kbd: { content: '-' },
  },
  {
    kind: 'orderedList',
    label: 'Numbered list',
    description: 'Steps in order',
    icon: 'icon-[gravity-ui--list-ol]',
    kbd: { content: '1.' },
  },
  {
    kind: 'blockquote',
    label: 'Quote',
    description: 'A user quote or a note',
    icon: 'icon-[gravity-ui--quote-open]',
    kbd: { content: '>' },
  },
  {
    kind: 'codeBlock',
    label: 'Code block',
    description: 'Monospaced snippet',
    icon: 'icon-[gravity-ui--code]',
    kbd: { content: '```' },
  },
  {
    kind: 'horizontalRule',
    label: 'Divider',
    description: 'Line between sections',
    icon: 'icon-[gravity-ui--minus]',
    kbd: { content: '---' },
  },
]
</script>
