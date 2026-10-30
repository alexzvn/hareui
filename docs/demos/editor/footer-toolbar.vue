<template>
  <Editor
    v-model="content"
    aria-label="Reply"
    class="max-w-[600px]"
    :ui="{ base: 'min-h-[140px]', footer: 'px-2' }"
  >
    <template #footer="{ editor }">
      <EditorToolbar :editor="editor" :items="items" class="min-h-0 w-auto p-0" />
      <span class="tabular-nums">{{ editor.state.doc.textContent.length }} characters</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content =
  ref(`<p>Thanks for the quick review! I moved the formatting controls below the text, the way a chat reply box does.</p>
<ul>
<li><p>The <strong>footer</strong> slot holds the toolbar and the counter.</p></li>
<li><p>The editor and its commands stay the same.</p></li>
</ul>`)

const items: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold' },
  { kind: 'mark', mark: 'italic' },
  { kind: 'bulletList' },
  { kind: 'link' },
]
</script>
