<template>
  <Editor v-model="content" aria-label="Release notes" class="max-w-[760px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Release 2.4</h2>
<p>Select some text and use the toolbar. Buttons light up for the formats at the caret, and grey out when a command can't run.</p>
<ul>
<li><p>Faster search across <strong>every workspace</strong>.</p></li>
<li><p>Shared drafts keep their <em>comments</em> when copied.</p></li>
</ul>
<blockquote><p>Thanks to everyone who sent feedback on the beta.</p></blockquote>`)

const items: EditorToolbarItem[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [{ kind: 'paragraph' }, { kind: 'heading', level: 2 }, { kind: 'heading', level: 3 }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'underline' },
    { kind: 'mark', mark: 'strike' },
    { kind: 'mark', mark: 'code' },
  ],
  [{ kind: 'bulletList' }, { kind: 'orderedList' }, { kind: 'blockquote' }, { kind: 'codeBlock' }],
  [{ kind: 'link' }, { kind: 'image' }, { kind: 'horizontalRule' }, { kind: 'clearFormatting' }],
]
</script>
