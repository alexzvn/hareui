import type { EditorCommand } from '@/components/editor/Editor.types'

import type { EditorToolbarIconName } from './icons'

type CommandDefaults = { icon: EditorToolbarIconName; label: string }

type CommandDefaultsResolver = (command: EditorCommand) => CommandDefaults | undefined

const MARKS: Record<string, CommandDefaults> = {
  bold: { icon: 'bold', label: 'Bold' },
  italic: { icon: 'italic', label: 'Italic' },
  underline: { icon: 'underline', label: 'Underline' },
  strike: { icon: 'strike', label: 'Strikethrough' },
  code: { icon: 'code', label: 'Inline code' },
}

const ALIGNMENTS: Record<string, CommandDefaults> = {
  left: { icon: 'alignLeft', label: 'Align left' },
  center: { icon: 'alignCenter', label: 'Align center' },
  right: { icon: 'alignRight', label: 'Align right' },
  justify: { icon: 'alignJustify', label: 'Justify' },
}

const fixed =
  (defaults: CommandDefaults): CommandDefaultsResolver =>
  () =>
    defaults

const RESOLVERS: Record<string, CommandDefaultsResolver> = {
  mark: (command) => MARKS[command.mark ?? ''],
  textAlign: (command) => ALIGNMENTS[command.align ?? ''],
  heading: (command) =>
    command.level
      ? {
          icon: `heading${command.level}` as EditorToolbarIconName,
          label: `Heading ${command.level}`,
        }
      : undefined,
  link: fixed({ icon: 'link', label: 'Link' }),
  image: fixed({ icon: 'image', label: 'Image' }),
  blockquote: fixed({ icon: 'blockquote', label: 'Quote' }),
  bulletList: fixed({ icon: 'bulletList', label: 'Bullet list' }),
  orderedList: fixed({ icon: 'orderedList', label: 'Numbered list' }),
  taskList: fixed({ icon: 'taskList', label: 'Task list' }),
  codeBlock: fixed({ icon: 'codeBlock', label: 'Code block' }),
  horizontalRule: fixed({ icon: 'horizontalRule', label: 'Divider' }),
  paragraph: fixed({ icon: 'paragraph', label: 'Paragraph' }),
  undo: fixed({ icon: 'undo', label: 'Undo' }),
  redo: fixed({ icon: 'redo', label: 'Redo' }),
  clearFormatting: fixed({ icon: 'clearFormatting', label: 'Clear formatting' }),
}

/** The built-in icon and English name of a command, when its kind is built in. */
export const getCommandDefaults = (command: EditorCommand) => RESOLVERS[command.kind]?.(command)
