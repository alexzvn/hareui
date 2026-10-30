<template>
  <div class="w-full max-w-[760px] rounded-3xl bg-surface p-4">
    <Editor v-model="content" variant="secondary" aria-label="Meeting agenda">
      <template #default="{ editor }">
        <EditorToolbar :editor="editor" :items="items" />
      </template>

      <template #footer>
        <span>Shared with the design team</span>
      </template>
    </Editor>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Weekly design sync</h2>
<p>The <em>secondary</em> surface suits an editor placed on a card or inside a panel.</p>
<ol>
<li><p>Review the onboarding flow mockups.</p></li>
<li><p>Agree on the icon set for the settings page.</p></li>
<li><p>Pick an owner for the accessibility audit.</p></li>
</ol>`)

const items: EditorToolbarItem[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'underline' },
  ],
  [{ kind: 'heading', level: 2 }, { kind: 'blockquote' }],
  [{ kind: 'bulletList' }, { kind: 'orderedList' }],
]
</script>
