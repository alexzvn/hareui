<template>
  <Editor v-model="content" aria-label="Announcement" class="max-w-[680px]">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items">
        <template #publish="{ item, isDisabled, onClick }">
          <Button size="sm" :disabled="isDisabled(item)" @click="onClick($event, item)">
            Publish
          </Button>
        </template>
      </EditorToolbar>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorToolbarItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(
  `<p>The office is closed on Monday for the move. <strong>Badges</strong> for the new building are at the front desk from Tuesday.</p>`,
)

const items: EditorToolbarItem[][] = [
  [{ kind: 'mark', mark: 'bold' }, { kind: 'mark', mark: 'italic' }, { kind: 'link' }],
  [
    {
      slot: 'publish',
      onClick: () => alert(`Published: ${content.value.length} characters of HTML`),
    },
  ],
]
</script>
