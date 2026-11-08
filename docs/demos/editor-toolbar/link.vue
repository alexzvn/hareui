<template>
  <Editor v-model="content" aria-label="Reading list" class="max-w-[680px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h3>Reading list</h3>
<p>Select a few words and press the link button to give them a URL. Put the caret inside <a href="https://example.com/field-notes">the field notes</a> to edit or remove that link.</p>
<p>Press the image button to drop a picture at the caret, or select a picture and press it again to swap the URL. Enter applies, Escape leaves things as they are.</p>`)

const items: EditorToolbarItem[][] = [
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
  ],
  [{ kind: 'link' }, { kind: 'image' }],
]
</script>
