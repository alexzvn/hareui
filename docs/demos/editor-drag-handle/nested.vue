<template>
  <Editor v-model="content" aria-label="Sprint plan" :extensions="extensions" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorDragHandle :editor="editor" nested @select="(block) => onSelect({ editor, block })" />
    </template>

    <template #footer>
      <span class="truncate">{{ selected || 'No block selected' }}</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor } from '@hareui/vue/editor'
import { EditorDragHandle } from '@hareui/vue/editor-drag-handle'
import type { EditorDragHandleBlock } from '@hareui/vue/editor-drag-handle'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { ref } from 'vue'

const extensions = [TaskList, TaskItem.configure({ nested: true })]

const content = ref(`<h2>Sprint plan</h2>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="true"><p>Ship the billing page.</p></li>
<li data-type="taskItem" data-checked="false"><p>Fix the export timeout.</p></li>
<li data-type="taskItem" data-checked="false"><p>Write the migration guide.</p>
<ul data-type="taskList">
<li data-type="taskItem" data-checked="false"><p>Rename the plan fields.</p></li>
<li data-type="taskItem" data-checked="false"><p>List the removed endpoints.</p></li>
</ul>
</li>
</ul>
<blockquote><p>Keep each task under two days. Split anything bigger.</p></blockquote>`)

const BLOCK_NAMES: Record<string, string> = {
  taskItem: 'Task',
  taskList: 'Task list',
  paragraph: 'Paragraph',
  heading: 'Heading',
  blockquote: 'Quote',
}

const selected = ref('')

const onSelect = ({ editor, block }: { editor: TiptapEditor; block: EditorDragHandleBlock }) => {
  const type = block.node.type ?? ''
  const text = editor.state.doc.nodeAt(block.pos)?.textContent ?? ''

  selected.value = `${BLOCK_NAMES[type] ?? type}: ${text}`
}
</script>
