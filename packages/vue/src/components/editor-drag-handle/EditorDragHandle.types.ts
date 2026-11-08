import type { JSONContent, Editor as TiptapEditor } from '@tiptap/vue-3'
import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EditorDragHandle = typeof theme

/** The resolved slot class functions of `EditorDragHandle`. */
export type EditorDragHandleUI = ComponentUI<EditorDragHandle>

/** A block of the document and the position it starts at. */
export type EditorDragHandleBlock = {
  /** The block as JSON. */
  node: JSONContent
  /** The document position just before the block: the `pos` the block handler kinds (`duplicate`, `delete`, `moveUp`, `moveDown`) take. */
  pos: number
}

/** Props of `EditorDragHandle`: a grip next to the hovered block that drags it elsewhere or selects it on click. */
export type EditorDragHandleProps = {
  /** The editor to add the handle to: the `editor` prop of the `Editor` slots. Read when the handle mounts. */
  editor: TiptapEditor
  /** The icon of the default handle: an icon class or a component. Defaults to a six-dot grip. */
  icon?: IconValue
  /** Accessible name of the default handle. Defaults to the locale's `editorDragHandle.label`. */
  label?: string
  /**
   * Also shows the handle on nested blocks, such as list items and the paragraphs of a quote, instead of only on
   * top-level ones. Read when the handle mounts.
   * @defaultValue false
   */
  nested?: boolean
  /**
   * The gap between the handle and the start of the block, in pixels. Read when the handle mounts.
   * @defaultValue 8
   */
  sideOffset?: number
  /** Additional classes merged into the positioned element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EditorDragHandle>
}

/** Events of `EditorDragHandle`. */
export type EditorDragHandleEmits = {
  /** Emitted when the pointer moves onto another block. The block is serialized to JSON on every change. */
  hover: [block: EditorDragHandleBlock]
  /** Emitted when the handle is clicked, after the block is selected and the editor focused. */
  select: [block: EditorDragHandleBlock]
  /** Emitted when a block starts being dragged. */
  dragStart: [event: DragEvent]
  /** Emitted when the drag ends, dropped or not. */
  dragEnd: [event: DragEvent]
}

/** Slots of `EditorDragHandle`. */
export type EditorDragHandleSlots = {
  /**
   * Replaces the handle. Dragging anywhere on it drags the block. Call `select` on click to select the block and
   * focus the editor; it returns the block with its `pos`.
   */
  default?: (props: {
    ui: EditorDragHandleUI
    select: () => EditorDragHandleBlock | undefined
  }) => VNode[]
}
