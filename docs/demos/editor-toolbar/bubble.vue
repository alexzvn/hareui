<template>
  <Editor v-model="content" aria-label="Product description" class="max-w-[680px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" layout="bubble" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h3>Ceramic pour-over set</h3>
<p>Select any words in this paragraph: a toolbar with the inline formats appears next to the selection. Nothing takes room when no text is selected.</p>
<p>Hand-glazed stoneware, dishwasher safe, ships with <strong>two filters</strong> and a cleaning brush.</p>`)

const items: EditorToolbarItem[][] = [
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'underline' },
    { kind: 'mark', mark: 'strike' },
  ],
  [{ kind: 'link' }],
]
</script>
