<template>
  <Editor v-model="content" :handlers="handlers" aria-label="Trip notes" class="max-w-[760px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>

    <template #footer="{ editor }">
      <span>Saved on this device</span>
      <span class="tabular-nums">{{ countLabel(editor) }}</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorCustomHandlers, EditorToolbarItem } from '@hareui/vue/editor'
import { Icon } from '@iconify/vue'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { h, ref } from 'vue'

const content = ref(`<h2>Alpine loop, day 3</h2>
<blockquote><p>Leave the hut before 7:00, the afternoon storms roll in around 14:00 this week.</p></blockquote>
<p>The ridge section is <strong>exposed for about 40 minutes</strong>, so pack the light shell and keep the map on top of the bag.</p>
<h3>Packing list</h3>
<ul>
<li><p>Two liters of water per person, refill at the lake.</p></li>
<li><p>Sun cream and the spare battery for the GPS.</p></li>
<li><p>Book the dinner slot at <a href="https://example.com">the refuge</a> before noon.</p></li>
</ul>
<pre><code>Start 06:45 · Pass 10:30 · Hut 15:00</code></pre>`)

const TrashIcon = () => h(Icon, { icon: 'gravity-ui:trash-bin' })

const handlers = {
  clearDocument: {
    canExecute: (editor) => !editor.isEmpty,
    execute: (editor) => editor.chain().focus().clearContent(true),
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

const items: EditorToolbarItem<typeof handlers>[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'underline' },
    { kind: 'mark', mark: 'strike' },
    { kind: 'mark', mark: 'code' },
  ],
  [
    { kind: 'heading', level: 1 },
    { kind: 'heading', level: 2 },
    { kind: 'heading', level: 3 },
    { kind: 'blockquote' },
    { kind: 'codeBlock' },
  ],
  [{ kind: 'bulletList' }, { kind: 'orderedList' }, { kind: 'link' }],
  [
    { kind: 'clearFormatting' },
    { kind: 'clearDocument', icon: TrashIcon, tooltip: 'Clear document' },
  ],
]

const countLabel = (editor: TiptapEditor) => {
  const text = editor.state.doc.textContent
  const words = text.split(/\s+/).filter(Boolean).length

  return `${text.length} characters, ${words} words`
}
</script>
