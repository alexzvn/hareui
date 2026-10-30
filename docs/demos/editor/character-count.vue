<template>
  <Editor v-model="content" aria-label="Short bio" class="max-w-[680px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>

    <template #footer="{ editor }">
      <span>Bios are limited to {{ LIMIT }} characters</span>
      <span class="tabular-nums" :class="count(editor) > LIMIT ? 'text-danger' : undefined">
        {{ count(editor) }} / {{ LIMIT }}
      </span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { ref } from 'vue'

const LIMIT = 160

const content = ref(
  `<p>Product designer in Lisbon. I sketch interfaces, bake bread on weekends and collect <em>far too many</em> notebooks.</p>`,
)

const items: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold' },
  { kind: 'mark', mark: 'italic' },
  { kind: 'link' },
]

const count = (editor: TiptapEditor) => editor.state.doc.textContent.length
</script>
