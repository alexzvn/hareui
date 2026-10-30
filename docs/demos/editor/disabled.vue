<template>
  <div class="grid w-full max-w-[860px] gap-4 md:grid-cols-2">
    <Editor :model-value="locked" disabled aria-label="Locked policy">
      <template #default="{ editor }">
        <EditorToolbar :editor="editor" :items="items" />
      </template>

      <template #footer>
        <span>Disabled</span>
      </template>
    </Editor>

    <Editor :model-value="archived" :editable="false" aria-label="Archived changelog">
      <template #default="{ editor }">
        <EditorToolbar :editor="editor" :items="items" />
      </template>

      <template #footer>
        <span>Read-only</span>
      </template>
    </Editor>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'

const locked = `<h3>Refund policy</h3>
<p>Only the finance team can change this text while the quarter is being closed.</p>
<ul><li><p>Ask in #finance for edit access.</p></li></ul>`

const archived = `<h3>Version 2.4 changelog</h3>
<p>This entry was published, so it can be read and copied but no longer edited.</p>
<ul><li><p>Faster search on large workspaces.</p></li></ul>`

const items: EditorToolbarItem[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
  ],
  [{ kind: 'bulletList' }, { kind: 'link' }],
]
</script>
