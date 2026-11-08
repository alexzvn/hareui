import type { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model'
import { NodeSelection, Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { EditorView } from '@tiptap/pm/view'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, useId } from 'vue'

import { getDropIndex, getShiftOffsets, isInsideContainer } from './reorder'
import type { BlockLayout } from './reorder'

type ReorderOptions = {
  editor: TiptapEditor
  /** Classes of the dragged blocks' siblings, the dragged blocks included, while they're dragged. */
  blockClass: () => string
  /** Classes of the dragged blocks, on top of `blockClass`. */
  draggedBlockClass: () => string
}

// One drag of sibling blocks from the handle, measured when the pointer first moves over the editor.
type ReorderSession = {
  /** The document the measurements belong to; any other change ends the preview. */
  doc: ProseMirrorNode
  /** The position where the parent's content starts. */
  contentStart: number
  /** The parent's element: the origin of the layout, as it never moves itself. */
  parentElement: HTMLElement
  /**
   * Blocks reorder while the pointer is between their siblings. Over the middle of a list or quote, a drop lands inside
   * it instead; a nested block also leaves its parent once the pointer does.
   */
  isNested: boolean
  /** The blocks before any of them shifted, so the target never follows a block moving out of the way. */
  layout: BlockLayout
  /** The block the dragged ones land before; `null` leaves the drop to ProseMirror and its drop cursor. */
  index: number | null
}

type ReorderState = { decorations: DecorationSet; isPreviewing: boolean }

const IDLE: ReorderState = { decorations: DecorationSet.empty, isPreviewing: false }

// ProseMirror copies instead of moving while this key is held.
const COPY_MODIFIER =
  typeof navigator !== 'undefined' && /Mac|iP(?:hone|ad|od)/.test(navigator.platform)
    ? 'altKey'
    : 'ctrlKey'

// Each child of the parent `$content` points into, with its position and element.
const getChildren = (view: EditorView, $content: ResolvedPos) =>
  Array.from({ length: $content.parent.childCount }, (_, index) => {
    const pos = $content.posAtIndex(index)
    const dom = view.nodeDOM(pos)

    return {
      node: $content.parent.child(index),
      pos,
      element: dom instanceof HTMLElement ? dom : null,
    }
  })

// The dragged blocks are the selection the drag handle set: whole siblings of one parent.
const createSession = (view: EditorView): ReorderSession | null => {
  const { doc, selection } = view.state
  const $from = doc.resolve(selection.from)
  const $to = doc.resolve(selection.to)
  const range = { from: $from.index(), to: $to.index() }
  const contentStart = $from.start()

  if ($to.start() !== contentStart || range.to <= range.from) return null

  const parentElement = $from.depth === 0 ? view.dom : view.nodeDOM($from.before())
  const children = getChildren(view, $from)
  if (!(parentElement instanceof HTMLElement) || children.some(({ element }) => !element))
    return null

  const origin = parentElement.getBoundingClientRect().top

  // Blocks with block content, like lists and quotes, also take drops inside them.
  const extents = children.map(({ node, element }) => {
    const rect = element!.getBoundingClientRect()
    const isContainer = node.isBlock && !node.isTextblock && !node.isLeaf

    return { top: rect.top - origin, bottom: rect.bottom - origin, isContainer }
  })

  return {
    doc,
    contentStart,
    parentElement,
    isNested: $from.depth > 0,
    layout: { extents, range },
    index: null,
  }
}

const resolveIndex = (session: ReorderSession, event: DragEvent) => {
  const parentRect = session.parentElement.getBoundingClientRect()
  const y = event.clientY - parentRect.top
  const isInside = !session.isNested || (y >= 0 && y <= parentRect.height)

  if (event[COPY_MODIFIER] || !isInside || isInsideContainer(session.layout, y)) return null

  return getDropIndex(session.layout, y)
}

// Moves the dragged blocks before the session's target block, then selects them as ProseMirror's own drop does.
const createMoveTransaction = (state: EditorState, session: ReorderSession) => {
  const $content = state.doc.resolve(session.contentStart)
  const { range } = session.layout
  const from = $content.posAtIndex(range.from)
  const to = $content.posAtIndex(range.to)
  const content = $content.parent.content.cut(
    from - session.contentStart,
    to - session.contentStart,
  )

  const tr = state.tr.delete(from, to)
  const insertAt = tr.mapping.map($content.posAtIndex(session.index!))

  tr.insert(insertAt, content)

  const isSingleNode = content.childCount === 1 && NodeSelection.isSelectable(content.firstChild!)

  const selection = isSingleNode
    ? NodeSelection.create(tr.doc, insertAt)
    : TextSelection.between(tr.doc.resolve(insertAt), tr.doc.resolve(insertAt + content.size))

  return tr.setSelection(selection).setMeta('uiEvent', 'drop')
}

/**
 * Previews where blocks dragged from the handle will land: their siblings slide out of the way, the dragged blocks
 * move into the gap, and the drop puts them exactly there. Blocks then glide from where they were shown to where they
 * are, which also animates a cancelled drag back.
 */
export const useEditorDragReorder = (options: ReorderOptions) => {
  const { editor } = options
  const pluginKey = new PluginKey<ReorderState>(`editorDragReorder-${useId()}`)

  let isHandleDrag = false
  let session: ReorderSession | null = null

  const createDecorations = (view: EditorView, active: ReorderSession) => {
    const { range } = active.layout
    const offsets = active.index === null ? null : getShiftOffsets(active.layout, active.index)
    const blockClass = options.blockClass()
    const draggedClass = `${blockClass} ${options.draggedBlockClass()}`
    const children = getChildren(view, view.state.doc.resolve(active.contentStart))

    const decorations = children.map(({ node, pos }, index) => {
      const shift = offsets?.[index] ?? 0
      const isDragged = index >= range.from && index < range.to

      return Decoration.node(pos, pos + node.nodeSize, {
        class: isDragged ? draggedClass : blockClass,
        ...(shift ? { style: `transform: translateY(${shift}px)` } : {}),
      })
    })

    return DecorationSet.create(view.state.doc, decorations)
  }

  const showPreview = (view: EditorView, active: ReorderSession) => {
    const state: ReorderState = {
      decorations: createDecorations(view, active),
      isPreviewing: active.index !== null,
    }

    view.dispatch(view.state.tr.setMeta(pluginKey, state).setMeta('addToHistory', false))
  }

  // Ends the preview with `tr`, then glides every block from where it was shown to where it is now. Blocks drop the
  // transition class in the same update, so they jump to their place before gliding instead of transitioning twice.
  // Blocks are matched by node, which a move keeps.
  const finish = (view: EditorView, tr: Transaction) => {
    if (!session) return

    const { contentStart } = session
    const shown = getChildren(view, view.state.doc.resolve(contentStart))
    const style = shown[0]?.element ? getComputedStyle(shown[0].element) : null
    const duration = Number.parseFloat(style?.transitionDuration ?? '') * 1000 || 0

    // The first of the listed easings; commas inside `cubic-bezier(…)` don't separate them.
    const easing = style?.transitionTimingFunction.split(/,(?![^(]*\))/)[0] || 'ease'

    const shownTops = new Map(
      shown.map(({ node, element }) => [node, element?.getBoundingClientRect().top]),
    )

    session = null
    isHandleDrag = false
    view.dispatch(tr.setMeta(pluginKey, IDLE))

    if (!duration) return

    for (const { node, element } of getChildren(view, view.state.doc.resolve(contentStart))) {
      const shownTop = shownTops.get(node)
      if (!element || shownTop === undefined) continue

      const delta = shownTop - element.getBoundingClientRect().top
      if (Math.abs(delta) < 1) continue

      element.animate([{ transform: `translateY(${delta}px)` }, { transform: 'none' }], {
        duration,
        easing,
      })
    }
  }

  const onDragOver = (view: EditorView, event: DragEvent) => {
    if (!isHandleDrag || !view.dragging) return false

    session ??= createSession(view)

    if (!session || session.doc !== view.state.doc) {
      isHandleDrag = false

      return false
    }

    const index = resolveIndex(session, event)
    if (index === session.index) return false

    session.index = index
    showPreview(view, session)

    return false
  }

  const onDragLeave = (view: EditorView, event: DragEvent) => {
    const isLeavingEditor = !view.dom.contains(event.relatedTarget as Node | null)
    if (!session || session.index === null || !isLeavingEditor) return false

    session.index = null
    showPreview(view, session)

    return false
  }

  const onDrop = (view: EditorView, event: DragEvent) => {
    if (!session || session.index === null || session.doc !== view.state.doc) return false

    event.preventDefault()
    view.dragging = null
    view.focus()
    finish(view, createMoveTransaction(view.state, session))

    return true
  }

  const plugin = new Plugin<ReorderState>({
    key: pluginKey,
    state: {
      init: () => IDLE,
      apply: (tr, value) => {
        const next = tr.getMeta(pluginKey) as ReorderState | undefined
        if (next) return next

        return tr.docChanged ? IDLE : value
      },
    },
    props: {
      decorations: (state) => pluginKey.getState(state)?.decorations,
      // The Editor hides ProseMirror's drop cursor while the blocks show where the drop lands.
      attributes: (state): Record<string, string> =>
        pluginKey.getState(state)?.isPreviewing ? { 'data-reordering': '' } : {},
      handleDOMEvents: { dragover: onDragOver, dragleave: onDragLeave, drop: onDrop },
    },
  })

  const onDragStart = () => {
    isHandleDrag = true
  }

  // Also runs after a drop, which has already finished the preview.
  const onDragEnd = () => {
    if (session && !editor.isDestroyed) finish(editor.view, editor.state.tr)

    session = null
    isHandleDrag = false
  }

  // Mounting the view resets the editor's plugins, so the plugin is added again. It goes first so its drop handler
  // runs before the other plugins'.
  const register = () => {
    editor.registerPlugin(plugin, (own, plugins) => [own, ...plugins])
  }

  onMounted(() => {
    editor.on('mount', register)
    if (!editor.isDestroyed) register()
  })

  onBeforeUnmount(() => {
    editor.off('mount', register)
    if (editor.isDestroyed) return

    // `unregisterPlugin` matches keys by prefix; the merge callback drops just this plugin, as in `useEditorMenu`.
    editor.registerPlugin(plugin, (own, plugins) =>
      plugins.filter((candidate) => candidate !== own),
    )
  })

  return { onDragStart, onDragEnd }
}
