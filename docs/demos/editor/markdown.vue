<template>
  <div class="flex w-full max-w-[760px] flex-col gap-4">
    <Editor v-model="content" content-type="markdown" aria-label="README">
      <template #default="{ editor }">
        <EditorToolbar :editor="editor" :items="items" />
      </template>
    </Editor>

    <pre class="overflow-auto rounded-2xl bg-default p-3 font-mono text-xs whitespace-pre-wrap">{{
      content
    }}</pre>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`## Weather widget

A tiny card that shows **today's forecast** for one city.

- Set \`city\` to change the location
- Data refreshes every 30 minutes

> Edit the text above: the Markdown below follows every change.`)

const items: EditorToolbarItem[][] = [
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'code' },
  ],
  [{ kind: 'heading', level: 2 }, { kind: 'bulletList' }, { kind: 'blockquote' }],
]
</script>
