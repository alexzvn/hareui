<template>
  <Editor
    v-model="content"
    :handlers="handlers"
    placeholder="Type here, or use the menu on an empty line…"
    aria-label="Standup notes"
    class="max-w-[760px]"
  >
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="toolbarItems" />
      <EditorToolbar :editor="editor" :items="floatingItems" layout="floating" />
    </template>

    <template #footer>
      <span>Custom commands</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorCustomHandlers, EditorToolbarItem } from '@hareui/vue/editor'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const content = ref(`<h2>Standup, Thursday</h2>
<p>The two buttons in the toolbar run commands defined in this file: one stamps the current time, the other drops in a standup template.</p>
<p>Put the caret on the empty line below to see the floating menu.</p>
<p></p>`)

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const handlers = {
  insertTime: {
    canExecute: () => true,
    execute: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    isActive: () => false,
  },
  insertTemplate: {
    canExecute: () => true,
    execute: (editor) =>
      editor
        .chain()
        .focus()
        .insertContent(
          '<h3>Yesterday</h3><ul><li><p></p></li></ul><h3>Today</h3><ul><li><p></p></li></ul><h3>Blockers</h3><p>None</p>',
        ),
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

const toolbarItems: EditorToolbarItem<typeof handlers>[] = [
  { kind: 'insertTime', icon: icon('clock'), tooltip: 'Insert the time' },
  {
    kind: 'insertTemplate',
    icon: icon('layout-header-cells'),
    tooltip: 'Insert a standup template',
  },
]

const floatingItems: EditorToolbarItem<typeof handlers>[] = [
  { kind: 'heading', level: 3 },
  { kind: 'bulletList' },
  { kind: 'blockquote' },
  {
    kind: 'insertTemplate',
    icon: icon('layout-header-cells'),
    tooltip: 'Insert a standup template',
  },
]
</script>
