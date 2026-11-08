import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import type { Selection } from '@tiptap/pm/state'
import { Extension } from '@tiptap/vue-3'
import type { ChainedCommands, CommandProps, Editor } from '@tiptap/vue-3'

import type { EditorCommand, EditorHandler, EditorHandlers } from './Editor.types'

type Command = (...args: unknown[]) => unknown

type CommandCall = {
  name: string
  args?: unknown[]
}

// Commands are looked up by name: the ones an optional extension adds (text align, task list, image)
// only exist on `can()` / `chain()` when that extension is installed.
const canRun = (editor: Editor, { name, args = [] }: CommandCall) => {
  const command = (editor.can() as unknown as Record<string, Command | undefined>)[name]

  return command ? Boolean(command(...args)) : false
}

const chainRun = (chain: ChainedCommands, { name, args = [] }: CommandCall) => {
  const command = (chain as unknown as Record<string, Command | undefined>)[name]

  return command ? (command(...args) as ChainedCommands) : chain
}

const capitalize = (name: string) => `${name.charAt(0).toUpperCase()}${name.slice(1)}`

const hasExtension = (editor: Editor, name: string) =>
  editor.extensionManager.extensions.some((extension) => extension.name === name)

const isNodeTypeSelected = (editor: Editor, nodeTypes: string[]) => {
  const { from, to } = editor.state.selection
  let isSelected = false

  editor.state.doc.nodesBetween(from, to, (node) => {
    if (nodeTypes.includes(node.type.name)) isSelected = true
  })

  return isSelected
}

// Block commands don't apply inside an image selection or inline code.
const isBlockedSelection = (editor: Editor) =>
  isNodeTypeSelected(editor, ['image']) || editor.isActive('code')

const createToggleHandler = (name: string): EditorHandler => {
  const command = { name: `toggle${capitalize(name)}` }

  return {
    canExecute: (editor) => canRun(editor, command),
    execute: (editor) => chainRun(editor.chain().focus(), command),
    isActive: (editor) => editor.isActive(name),
    isDisabled: isBlockedSelection,
    isToggle: true,
  }
}

const createSetHandler = (name: string): EditorHandler => {
  const command = { name: `set${capitalize(name)}` }

  return {
    canExecute: (editor) => canRun(editor, command),
    execute: (editor) => chainRun(editor.chain().focus(), command),
    isActive: (editor) => editor.isActive(name),
    isDisabled: isBlockedSelection,
  }
}

const createHistoryHandler = (name: 'undo' | 'redo'): EditorHandler => ({
  canExecute: (editor) => canRun(editor, { name }),
  execute: (editor) => chainRun(editor.chain().focus(), { name }),
  isActive: () => false,
})

const markHandler: EditorHandler = {
  canExecute: (editor, command) => canRun(editor, { name: 'toggleMark', args: [command?.mark] }),
  execute: (editor, command) =>
    editor
      .chain()
      .focus()
      .toggleMark(command?.mark ?? ''),
  isActive: (editor, command) => (command?.mark ? editor.isActive(command.mark) : false),
  isDisabled: (editor, command) => {
    const isInSchema = !!command?.mark && editor.schema.spec.marks.get(command.mark) !== undefined

    return !isInSchema || isNodeTypeSelected(editor, ['image'])
  },
  isToggle: true,
}

const textAlignHandler: EditorHandler = {
  canExecute: (editor, command) => canRun(editor, { name: 'setTextAlign', args: [command?.align] }),
  execute: (editor, command) =>
    chainRun(editor.chain().focus(), { name: 'setTextAlign', args: [command?.align] }),
  isActive: (editor, command) => editor.isActive({ textAlign: command?.align }),
  isDisabled: (editor) =>
    !hasExtension(editor, 'textAlign') || isNodeTypeSelected(editor, ['image', 'horizontalRule']),
  isToggle: true,
}

const headingHandler: EditorHandler = {
  canExecute: (editor, command) =>
    canRun(editor, { name: 'toggleHeading', args: [{ level: command?.level }] }),
  execute: (editor, command) =>
    chainRun(editor.chain().focus(), { name: 'toggleHeading', args: [{ level: command?.level }] }),
  isActive: (editor, command) => editor.isActive('heading', { level: command?.level }),
  isDisabled: isBlockedSelection,
  isToggle: true,
}

const linkHandler: EditorHandler = {
  canExecute: (editor) =>
    canRun(editor, { name: 'setLink', args: [{ href: '' }] }) ||
    canRun(editor, { name: 'unsetLink' }),
  execute: (editor, command) => {
    const chain = editor.chain().focus()
    if (!command?.href) return chainRun(chain.extendMarkRange('link'), { name: 'unsetLink' })

    // Linking inline code selects the whole code run; editing a link selects the whole link.
    const target = chain.extendMarkRange(editor.isActive('code') ? 'code' : 'link')

    return chainRun(target, { name: 'setLink', args: [{ href: command.href }] })
  },
  isActive: (editor) => editor.isActive('link'),
  isDisabled: (editor) => {
    if (!hasExtension(editor, 'link') || isNodeTypeSelected(editor, ['image'])) return true

    // Needs selected text to link, unless a link is there to remove.
    return editor.state.selection.empty && !editor.isActive('link')
  },
  isToggle: true,
}

const imageHandler: EditorHandler = {
  canExecute: (editor) => canRun(editor, { name: 'setImage', args: [{ src: '' }] }),
  execute: (editor, command) => {
    const chain = editor.chain().focus()
    if (!command?.src) return chain

    return chainRun(chain, { name: 'setImage', args: [{ src: command.src }] })
  },
  isActive: (editor) => editor.isActive('image'),
  isDisabled: (editor) => !hasExtension(editor, 'image'),
}

const LIST_TYPES = ['bulletList', 'orderedList', 'taskList'] as const

type ListType = (typeof LIST_TYPES)[number]

const getActiveListType = (editor: Editor) =>
  LIST_TYPES.find((type) => hasExtension(editor, type) && editor.isActive(type))

// Lifts the selection out of the list item, then out of every list wrapper left around it.
const unwrapList = (
  editor: Editor,
  { chain, type }: { chain: ChainedCommands; type: ListType },
) => {
  const itemType = type === 'taskList' ? 'taskItem' : 'listItem'

  return LIST_TYPES.filter((listType) => hasExtension(editor, listType)).reduce(
    (lifted, listType) => lifted.lift(listType),
    chain.liftListItem(itemType),
  )
}

const createListHandler = (type: ListType): EditorHandler => {
  const command = { name: `toggle${capitalize(type)}` }

  return {
    canExecute: (editor) =>
      canRun(editor, command) || editor.isActive('listItem') || !!getActiveListType(editor),
    execute: (editor) => {
      const chain = editor.chain().focus()
      const activeType = getActiveListType(editor)
      if (activeType === type) return unwrapList(editor, { chain, type }).selectTextblockEnd()

      // Another list type: unwrap it first, then wrap in this one.
      const unwrapped = activeType ? unwrapList(editor, { chain, type: activeType }) : chain

      return chainRun(unwrapped, command).selectTextblockEnd()
    },
    isActive: (editor) => editor.isActive(type),
    isDisabled: (editor) => !hasExtension(editor, type) || isBlockedSelection(editor),
    isToggle: true,
  }
}

const clearFormattingHandler: EditorHandler = {
  canExecute: (editor) => editor.can().clearNodes() || editor.can().unsetAllMarks(),
  execute: (editor) => editor.chain().focus().clearNodes().unsetAllMarks(),
  isActive: () => false,
}

type BlockState = {
  doc: ProseMirrorNode
  selection: Selection
}

type Block = {
  node: ProseMirrorNode
  pos: number
}

type MoveDirection = 'up' | 'down'

// Without a `pos`, the block is the selected node or the top-level block holding the cursor.
const resolveBlockPos = ({ selection }: BlockState, pos?: number) => {
  if (pos !== undefined) return pos
  if (selection instanceof NodeSelection) return selection.from

  return selection.$from.depth > 0 ? selection.$from.before(1) : undefined
}

const resolveBlock = (state: BlockState, pos?: number): Block | undefined => {
  const blockPos = resolveBlockPos(state, pos)
  const node = blockPos === undefined ? null : state.doc.nodeAt(blockPos)

  return node && blockPos !== undefined ? { node, pos: blockPos } : undefined
}

// The sibling the block swaps places with; none at the edge of its parent.
const getSibling = (
  doc: ProseMirrorNode,
  { block, direction }: { block: Block; direction: MoveDirection },
) => {
  const $pos = doc.resolve(block.pos)
  const index = $pos.index() + (direction === 'up' ? -1 : 1)

  return index >= 0 && index < $pos.parent.childCount ? $pos.parent.child(index) : undefined
}

// Keeps a selection that sat on or inside the block with it at its new position.
const followBlock = ({
  tr,
  block,
  target,
}: {
  tr: CommandProps['tr']
  block: Block
  target: number
}) => {
  const { selection } = tr
  const end = block.pos + block.node.nodeSize
  const isNodeSelected = selection instanceof NodeSelection && selection.from === block.pos
  const isInside = selection.from >= block.pos && selection.to <= end

  tr.delete(block.pos, end).insert(target, block.node)

  if (isNodeSelected) {
    tr.setSelection(NodeSelection.create(tr.doc, target))
    return
  }

  if (!isInside) return

  const shift = target - block.pos
  tr.setSelection(TextSelection.create(tr.doc, selection.from + shift, selection.to + shift))
}

const createMoveCommand =
  ({ direction, pos }: { direction: MoveDirection; pos?: number }) =>
  ({ tr, dispatch }: CommandProps) => {
    const block = resolveBlock(tr, pos)
    const sibling = block && getSibling(tr.doc, { block, direction })
    if (!block || !sibling) return false
    if (!dispatch) return true

    const target = direction === 'up' ? block.pos - sibling.nodeSize : block.pos + sibling.nodeSize
    followBlock({ tr, block, target })

    return true
  }

const createMoveHandler = (direction: MoveDirection): EditorHandler => ({
  canExecute: (editor, command) => {
    const block = resolveBlock(editor.state, command?.pos)

    return !!block && !!getSibling(editor.state.doc, { block, direction })
  },
  execute: (editor, command) =>
    editor
      .chain()
      .focus()
      .command(createMoveCommand({ direction, pos: command?.pos })),
  isActive: () => false,
})

const duplicateHandler: EditorHandler = {
  canExecute: (editor, command) => !!resolveBlock(editor.state, command?.pos),
  execute: (editor, command) =>
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const block = resolveBlock(tr, command?.pos)
        if (!block) return false

        dispatch?.(tr.insert(block.pos + block.node.nodeSize, block.node))

        return true
      }),
  isActive: () => false,
}

const deleteHandler: EditorHandler = {
  canExecute: (editor, command) => !!resolveBlock(editor.state, command?.pos),
  execute: (editor, command) =>
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const block = resolveBlock(tr, command?.pos)
        if (!block) return false

        dispatch?.(tr.delete(block.pos, block.pos + block.node.nodeSize))

        return true
      }),
  isActive: () => false,
}

// Types the trigger character of a suggestion or mention menu, after a space when it would touch other text.
const createTriggerHandler = (defaultChar: string): EditorHandler => {
  const resolveText = (editor: Editor, command?: EditorCommand) => {
    const char = command?.char ?? defaultChar
    const { from } = editor.state.selection
    const before = editor.state.doc.textBetween(Math.max(0, from - 1), from)

    return before === '' || /\s/.test(before) ? char : ` ${char}`
  }

  return {
    canExecute: (editor, command) =>
      canRun(editor, { name: 'insertContent', args: [resolveText(editor, command)] }),
    execute: (editor, command) =>
      editor.chain().focus().insertContent(resolveText(editor, command)),
    isActive: () => false,
    isDisabled: (editor) => editor.isActive('codeBlock'),
  }
}

/** Alt+Shift+Up and Alt+Shift+Down move the block at the cursor, like dragging it with an `EditorDragHandle`. */
export const BlockKeymap = Extension.create({
  name: 'blockKeymap',
  addKeyboardShortcuts: () => ({
    'Alt-Shift-ArrowUp': ({ editor }) =>
      editor.commands.command(createMoveCommand({ direction: 'up' })),
    'Alt-Shift-ArrowDown': ({ editor }) =>
      editor.commands.command(createMoveCommand({ direction: 'down' })),
  }),
})

/** Creates the built-in handlers, keyed by command kind. */
export const createEditorHandlers = (): EditorHandlers => ({
  mark: markHandler,
  textAlign: textAlignHandler,
  heading: headingHandler,
  link: linkHandler,
  image: imageHandler,
  blockquote: createToggleHandler('blockquote'),
  bulletList: createListHandler('bulletList'),
  orderedList: createListHandler('orderedList'),
  taskList: createListHandler('taskList'),
  codeBlock: createToggleHandler('codeBlock'),
  horizontalRule: createSetHandler('horizontalRule'),
  paragraph: createSetHandler('paragraph'),
  undo: createHistoryHandler('undo'),
  redo: createHistoryHandler('redo'),
  clearFormatting: clearFormattingHandler,
  duplicate: duplicateHandler,
  delete: deleteHandler,
  moveUp: createMoveHandler('up'),
  moveDown: createMoveHandler('down'),
  suggestion: createTriggerHandler('/'),
  mention: createTriggerHandler('@'),
})
