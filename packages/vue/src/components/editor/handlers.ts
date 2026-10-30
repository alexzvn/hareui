import type { ChainedCommands, Editor } from '@tiptap/vue-3'

import type { EditorHandler, EditorHandlers } from './Editor.types'

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
})
