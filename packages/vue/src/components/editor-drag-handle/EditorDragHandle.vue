<template>
  <DragHandle
    :editor="editor"
    :nested="nested"
    :compute-position-config="computePositionConfig"
    :on-node-change="onNodeChange"
    :on-element-drag-start="onDragStart"
    :on-element-drag-end="onDragEnd"
    :class="ui.base()"
    data-slot="editor-drag-handle"
  >
    <slot :ui="ui" :select="select">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon-only
        :aria-label="label ?? t('editorDragHandle.label')"
        :class="ui.handle()"
        data-slot="editor-drag-handle-button"
        @click="select"
      >
        <IconRenderer :icon="icon ?? GripIcon" :class="ui.handleIcon()" />
      </Button>
    </slot>
  </DragHandle>
</template>

<script setup lang="ts">
import DragHandle from '@tiptap/extension-drag-handle-vue-3'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

import Button from '@/components/button/Button.vue'
import { floatingMiddleware } from '@/components/editor-suggestion-menu/floating'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { GripIcon } from '@/utils/gripIcon'
import { IconRenderer } from '@/utils/icon'

import type {
  EditorDragHandleBlock,
  EditorDragHandleEmits,
  EditorDragHandleProps,
  EditorDragHandleSlots,
} from './EditorDragHandle.types'
import theme from './theme'
import { useEditorDragReorder } from './useEditorDragReorder'

const props = withDefaults(defineProps<EditorDragHandleProps>(), {
  nested: false,
  sideOffset: 8,
})

const emit = defineEmits<EditorDragHandleEmits>()

defineSlots<EditorDragHandleSlots>()

const ui = useComponentUI('editorDragHandle', { theme, variantProps: () => ({}), props })
const { t } = useLocale()

const computePositionConfig = {
  strategy: 'absolute' as const,
  placement: 'left-start' as const,
  middleware: floatingMiddleware({
    placement: 'left-start',
    offset: props.sideOffset,
    flip: true,
    shift: true,
  }),
}

const reorder = useEditorDragReorder({
  editor: props.editor,
  blockClass: () => ui.value.block(),
  draggedBlockClass: () => ui.value.draggedBlock(),
})

const onDragStart = (event: DragEvent) => {
  reorder.onDragStart()
  emit('dragStart', event)
}

const onDragEnd = (event: DragEvent) => {
  reorder.onDragEnd()
  emit('dragEnd', event)
}

// Where the block under the pointer starts; -1 while the pointer is outside the editor's blocks.
let hoveredPos = -1

const onNodeChange = ({ node, pos }: { node: ProseMirrorNode | null; pos: number }) => {
  hoveredPos = node ? pos : -1
  if (node) emit('hover', { node: node.toJSON(), pos })
}

const select = (): EditorDragHandleBlock | undefined => {
  const node = hoveredPos < 0 ? null : props.editor.state.doc.nodeAt(hoveredPos)

  if (!node) return undefined

  const block = { node: node.toJSON(), pos: hoveredPos }

  props.editor.chain().setNodeSelection(hoveredPos).focus().run()
  emit('select', block)

  return block
}
</script>
