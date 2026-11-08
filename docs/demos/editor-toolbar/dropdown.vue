<template>
  <Editor v-model="content" aria-label="Recipe" class="max-w-[680px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Lemon olive oil cake</h2>
<p>The first button opens a menu of block styles. Its icon follows the block the caret is in, and the menu checks it.</p>
<ul>
<li><p>200 g flour, 150 g sugar, 3 eggs.</p></li>
<li><p>120 ml olive oil and the zest of two lemons.</p></li>
</ul>`)

const items: EditorToolbarItem[][] = [
  [
    {
      'aria-label': 'Block style',
      tooltip: 'Block style',
      items: [
        { kind: 'paragraph' },
        { kind: 'heading', level: 1 },
        { kind: 'heading', level: 2 },
        { kind: 'heading', level: 3 },
      ],
    },
    {
      'aria-label': 'Lists',
      tooltip: 'Lists',
      items: [[{ kind: 'bulletList' }, { kind: 'orderedList' }], [{ kind: 'blockquote' }]],
    },
  ],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
  ],
]
</script>
