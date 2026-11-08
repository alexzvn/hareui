<template>
  <Editor v-model="content" aria-label="Release notes" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorSuggestionMenu :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
import type { EditorMenuEntry, EditorSuggestionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Release notes 4.2</h2>
<p>Offline forms, faster sync and a new export screen.</p>
<p></p>`)

const items: EditorMenuEntry<EditorSuggestionMenuItem>[] = [
  {
    type: 'section',
    label: 'Insert',
    items: [
      {
        label: "Today's date",
        description: 'The date, written out',
        icon: 'icon-[gravity-ui--calendar]',
        onSelect: (editor) =>
          editor
            .chain()
            .focus()
            .insertContent(new Date().toLocaleDateString([], { dateStyle: 'long' }))
            .run(),
      },
      {
        label: 'Changelog entry',
        description: 'A heading with a list of changes',
        icon: 'icon-[gravity-ui--list-timeline]',
        onSelect: (editor) =>
          editor
            .chain()
            .focus()
            .insertContent(
              '<h3>Version</h3><ul><li><p>Added: </p></li><li><p>Fixed: </p></li></ul>',
            )
            .run(),
      },
      {
        label: 'Callout',
        description: 'A note readers shouldn’t miss',
        icon: 'icon-[gravity-ui--circle-info]',
        onSelect: (editor) =>
          editor
            .chain()
            .focus()
            .insertContent('<blockquote><p><strong>Note:</strong> </p></blockquote>')
            .run(),
      },
    ],
  },
  {
    type: 'section',
    label: 'Blocks',
    items: [
      {
        kind: 'heading',
        level: 3,
        label: 'Heading',
        description: 'Section heading',
        icon: 'icon-[gravity-ui--heading-3]',
      },
      {
        kind: 'bulletList',
        label: 'Bullet list',
        description: 'Points in no order',
        icon: 'icon-[gravity-ui--list-ul]',
      },
      {
        kind: 'horizontalRule',
        label: 'Divider',
        description: 'Line between releases',
        icon: 'icon-[gravity-ui--minus]',
      },
    ],
  },
]
</script>
