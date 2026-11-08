<template>
  <Editor
    v-model="content"
    aria-label="Meeting notes"
    class="max-w-[640px]"
    placeholder="Type / for commands"
  >
    <template #default="{ editor }">
      <EditorSuggestionMenu :editor="editor" :items="items" :filter-fields="['label', 'aliases']" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
import type { EditorMenuEntry, EditorSuggestionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Weekly sync, 14 May</h2>
<p>Attendees: Maya, Leo, Priya.</p>
<p></p>`)

const items: EditorMenuEntry<EditorSuggestionMenuItem>[] = [
  {
    type: 'section',
    label: 'Text',
    items: [
      {
        kind: 'paragraph',
        label: 'Text',
        description: 'Plain paragraph',
        icon: 'icon-[gravity-ui--font-case]',
        aliases: ['p'],
      },
      {
        kind: 'heading',
        level: 1,
        label: 'Heading 1',
        description: 'Page title',
        icon: 'icon-[gravity-ui--heading-1]',
        aliases: ['h1', 'title'],
      },
      {
        kind: 'heading',
        level: 2,
        label: 'Heading 2',
        description: 'Section heading',
        icon: 'icon-[gravity-ui--heading-2]',
        aliases: ['h2'],
      },
      {
        kind: 'heading',
        level: 3,
        label: 'Heading 3',
        description: 'Subsection heading',
        icon: 'icon-[gravity-ui--heading-3]',
        aliases: ['h3'],
      },
    ],
  },
  {
    type: 'section',
    label: 'Lists',
    items: [
      {
        kind: 'bulletList',
        label: 'Bullet list',
        description: 'Points in no order',
        icon: 'icon-[gravity-ui--list-ul]',
        aliases: ['ul'],
      },
      {
        kind: 'orderedList',
        label: 'Numbered list',
        description: 'Steps in order',
        icon: 'icon-[gravity-ui--list-ol]',
        aliases: ['ol'],
      },
      {
        kind: 'taskList',
        label: 'To-do list',
        description: 'Action items to tick off',
        icon: 'icon-[gravity-ui--list-check]',
        aliases: ['todo', 'tasks'],
      },
    ],
  },
  {
    type: 'section',
    label: 'Blocks',
    items: [
      {
        kind: 'blockquote',
        label: 'Quote',
        description: 'Someone said it best',
        icon: 'icon-[gravity-ui--quote-open]',
      },
      {
        kind: 'codeBlock',
        label: 'Code block',
        description: 'Monospaced snippet',
        icon: 'icon-[gravity-ui--code]',
      },
      {
        kind: 'horizontalRule',
        label: 'Divider',
        description: 'Line between topics',
        icon: 'icon-[gravity-ui--minus]',
        aliases: ['hr', 'line'],
      },
    ],
  },
]
</script>
