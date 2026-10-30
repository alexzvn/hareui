<template>
  <Editor
    v-model="content"
    placeholder="Describe the bug: what you did, what you expected, what happened…"
    aria-label="Bug report"
    class="max-w-[680px]"
  >
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>

    <template #footer="{ editor }">
      <span>{{ editor.isEmpty ? 'Nothing written yet' : 'Draft' }}</span>
      <span class="tabular-nums">{{ editor.state.doc.textContent.length }} characters</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref('')

const items: EditorToolbarItem[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'code' },
  ],
  [{ kind: 'bulletList' }, { kind: 'orderedList' }, { kind: 'codeBlock' }],
]
</script>
