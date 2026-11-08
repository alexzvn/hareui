<template>
  <Editor
    v-model="content"
    aria-label="Retro board"
    placeholder="Type / for blocks"
    class="max-w-[640px]"
  >
    <template #default="{ editor, handlers }">
      <EditorDragHandle :editor="editor" :side-offset="4">
        <template #default="{ select, ui }">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon-only
            aria-label="Insert block below"
            :class="ui.handle({ class: 'w-5 cursor-pointer' })"
            @click="onInsert({ editor, handlers, select })"
          >
            <span :class="['icon-[gravity-ui--plus]', ui.handleIcon()]" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon-only
            aria-label="Drag to move, click to select"
            :class="ui.handle({ class: 'w-5' })"
            @click="select"
          >
            <span :class="['icon-[gravity-ui--grip]', ui.handleIcon()]" />
          </Button>
        </template>
      </EditorDragHandle>
      <EditorSuggestionMenu :editor="editor" :items="items" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
import type { EditorHandlers, EditorSuggestionMenuItem } from '@hareui/vue/editor'
import { EditorDragHandle } from '@hareui/vue/editor-drag-handle'
import type { EditorDragHandleBlock } from '@hareui/vue/editor-drag-handle'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { ref } from 'vue'

const content = ref(`<h2>Sprint 14 retro</h2>
<h3>Went well</h3>
<p>The on-call handover doc saved us twice.</p>
<h3>To improve</h3>
<p>Review requests sat for two days on average.</p>
<h3>Actions</h3>
<p>Pair on reviews every Tuesday afternoon.</p>`)

const items: EditorSuggestionMenuItem[] = [
  {
    kind: 'paragraph',
    label: 'Text',
    description: 'Plain paragraph',
    icon: 'icon-[gravity-ui--text]',
  },
  {
    kind: 'heading',
    level: 3,
    label: 'Heading',
    description: 'Board column',
    icon: 'icon-[gravity-ui--heading-3]',
  },
  {
    kind: 'bulletList',
    label: 'Bullet list',
    description: 'Points to talk through',
    icon: 'icon-[gravity-ui--list-ul]',
  },
  {
    kind: 'blockquote',
    label: 'Quote',
    description: 'Something a teammate said',
    icon: 'icon-[gravity-ui--quote-open]',
  },
]

// Adds an empty paragraph after the hovered block and types `/` in it, which opens the menu.
const onInsert = ({
  editor,
  handlers,
  select,
}: {
  editor: TiptapEditor
  handlers: EditorHandlers
  select: () => EditorDragHandleBlock | undefined
}) => {
  const block = select()
  const node = block && editor.state.doc.nodeAt(block.pos)
  if (!block || !node) return

  const end = block.pos + node.nodeSize

  editor
    .chain()
    .insertContentAt(end, { type: 'paragraph' })
    .setTextSelection(end + 1)
    .run()

  handlers.suggestion.execute(editor, { kind: 'suggestion' }).run()
}
</script>
