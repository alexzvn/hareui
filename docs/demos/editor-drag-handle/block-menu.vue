<template>
  <Editor v-model="content" aria-label="Product spec" class="max-w-[640px]">
    <template #default="{ editor, handlers }">
      <EditorDragHandle :editor="editor">
        <template #default="{ select, ui }">
          <Dropdown
            :items="items"
            @update:open="(isOpen: boolean) => onOpenChange({ editor, isOpen, select })"
            @action="(value) => onAction({ editor, handlers, value })"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon-only
              aria-label="Block actions"
              :class="ui.handle()"
            >
              <span :class="['icon-[gravity-ui--grip]', ui.handleIcon()]" />
            </Button>
          </Dropdown>
        </template>
      </EditorDragHandle>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import type { DropdownEntry, DropdownValue } from '@hareui/vue'
import { Dropdown } from '@hareui/vue'
import { Editor } from '@hareui/vue/editor'
import type { EditorCommand, EditorHandlers } from '@hareui/vue/editor'
import { EditorDragHandle } from '@hareui/vue/editor-drag-handle'
import type { EditorDragHandleBlock } from '@hareui/vue/editor-drag-handle'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { ref } from 'vue'

const content = ref(`<h2>Saved filters</h2>
<p>Let people save a search and get back to it from the sidebar.</p>
<h3>Goals</h3>
<p>Reopening a saved filter takes one click and keeps the sort order.</p>
<p>Filters can be shared with a link that opens the same results.</p>
<blockquote><p>Out of scope: scheduled email digests.</p></blockquote>`)

const items: DropdownEntry[] = [
  {
    type: 'section',
    label: 'Turn into',
    items: [
      { value: 'paragraph', label: 'Text', icon: 'icon-[gravity-ui--text]' },
      { value: 'heading', label: 'Heading', icon: 'icon-[gravity-ui--heading-3]' },
      { value: 'blockquote', label: 'Quote', icon: 'icon-[gravity-ui--quote-open]' },
    ],
  },
  { type: 'separator' },
  { value: 'duplicate', label: 'Duplicate', icon: 'icon-[gravity-ui--copy]' },
  {
    value: 'moveUp',
    label: 'Move up',
    icon: 'icon-[gravity-ui--arrow-up]',
    kbd: { keys: ['alt', 'shift', 'up'] },
  },
  {
    value: 'moveDown',
    label: 'Move down',
    icon: 'icon-[gravity-ui--arrow-down]',
    kbd: { keys: ['alt', 'shift', 'down'] },
  },
  { type: 'separator' },
  { value: 'delete', label: 'Delete', icon: 'icon-[gravity-ui--trash-bin]', variant: 'danger' },
]

// "Turn into" entries act on the cursor's block; the others take the block's position.
const TURN_INTO: Record<string, EditorCommand> = {
  paragraph: { kind: 'paragraph' },
  heading: { kind: 'heading', level: 3 },
  blockquote: { kind: 'blockquote' },
}

// The block the menu was opened for. The pointer leaves it on the way to the menu.
const block = ref<EditorDragHandleBlock>()

const onOpenChange = ({
  editor,
  isOpen,
  select,
}: {
  editor: TiptapEditor
  isOpen: boolean
  select: () => EditorDragHandleBlock | undefined
}) => {
  // Keeps the grip on this block while the menu is open.
  editor.commands.setMeta('lockDragHandle', isOpen)
  if (isOpen) block.value = select()
}

const onAction = ({
  editor,
  handlers,
  value,
}: {
  editor: TiptapEditor
  handlers: EditorHandlers
  value: DropdownValue
}) => {
  if (!block.value) return

  const turnInto = TURN_INTO[value]

  if (turnInto) {
    editor.commands.setTextSelection(block.value.pos + 1)
    handlers[turnInto.kind].execute(editor, turnInto).run()

    return
  }

  const command = { kind: String(value), pos: block.value.pos }
  handlers[command.kind].execute(editor, command).run()
}
</script>
