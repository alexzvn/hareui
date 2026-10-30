<template>
  <div class="flex w-full max-w-[760px] flex-col gap-4">
    <div class="flex items-center gap-2">
      <Button variant="secondary" @click="content = shoppingList">Shopping list</Button>
      <Button variant="secondary" @click="content = readingList">Reading list</Button>
    </div>

    <Editor v-model="content" content-type="json" aria-label="List">
      <template #default="{ editor }">
        <EditorToolbar :editor="editor" :items="items" />
      </template>

      <template #footer>
        <span>v-model holds a JSON document</span>
      </template>
    </Editor>

    <pre class="max-h-60 overflow-auto rounded-2xl bg-default p-3 font-mono text-xs">{{
      JSON.stringify(content, null, 2)
    }}</pre>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import type { JSONContent } from '@tiptap/vue-3'
import { ref } from 'vue'

const list = (title: string, entries: string[]): JSONContent => ({
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: title }] },
    {
      type: 'bulletList',
      content: entries.map((text) => ({
        type: 'listItem',
        content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
      })),
    },
  ],
})

const shoppingList = list('Shopping list', ['Oat milk', 'Basil', 'Sourdough'])
const readingList = list('Reading list', ['The Overstory', 'Piranesi'])

const content = ref<JSONContent>(shoppingList)

const items: EditorToolbarItem[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
  ],
  [{ kind: 'heading', level: 3 }, { kind: 'bulletList' }, { kind: 'orderedList' }],
]
</script>
