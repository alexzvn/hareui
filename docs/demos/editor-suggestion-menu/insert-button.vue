<template>
  <Editor v-model="content" aria-label="Weekly update" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="toolbarItems" layout="floating" />
      <EditorSuggestionMenu :editor="editor" :items="items" start-of-line />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorSuggestionMenu, EditorToolbar } from '@hareui/vue/editor'
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Weekly update, week 20</h2>
<p>Shipped the new onboarding emails. Sign-ups that finish setup went from 41% to 52%.</p>
<p></p>`)

const toolbarItems: EditorToolbarItem[] = [
  { kind: 'suggestion', icon: 'icon-[gravity-ui--plus]', tooltip: 'Insert block' },
]

const items: EditorSuggestionMenuItem[] = [
  {
    kind: 'heading',
    level: 3,
    label: 'Heading',
    description: 'Start a new topic',
    icon: 'icon-[gravity-ui--heading-3]',
  },
  {
    kind: 'bulletList',
    label: 'Bullet list',
    description: 'Wins, risks, next steps',
    icon: 'icon-[gravity-ui--list-ul]',
  },
  {
    kind: 'taskList',
    label: 'To-do list',
    description: 'Owners and deadlines',
    icon: 'icon-[gravity-ui--list-check]',
  },
  {
    kind: 'blockquote',
    label: 'Quote',
    description: 'Feedback from a customer',
    icon: 'icon-[gravity-ui--quote-open]',
  },
]
</script>
