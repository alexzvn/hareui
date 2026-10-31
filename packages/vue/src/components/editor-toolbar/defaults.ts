import type { EditorCommand } from '@/components/editor/Editor.types'
import type { TranslateParams } from '@/composables/useLocale'

import type { EditorToolbarIconName } from './icons'

/** `label` is a message key under `editorToolbar`, `params` fill its placeholders. */
type CommandDefaults = { icon: EditorToolbarIconName; label: string; params?: TranslateParams }

type CommandDefaultsResolver = (command: EditorCommand) => CommandDefaults | undefined

const MARKS: Record<string, CommandDefaults> = {
  bold: { icon: 'bold', label: 'editorToolbar.bold' },
  italic: { icon: 'italic', label: 'editorToolbar.italic' },
  underline: { icon: 'underline', label: 'editorToolbar.underline' },
  strike: { icon: 'strike', label: 'editorToolbar.strike' },
  code: { icon: 'code', label: 'editorToolbar.code' },
}

const ALIGNMENTS: Record<string, CommandDefaults> = {
  left: { icon: 'alignLeft', label: 'editorToolbar.alignLeft' },
  center: { icon: 'alignCenter', label: 'editorToolbar.alignCenter' },
  right: { icon: 'alignRight', label: 'editorToolbar.alignRight' },
  justify: { icon: 'alignJustify', label: 'editorToolbar.alignJustify' },
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
          label: 'editorToolbar.heading',
          params: { level: command.level },
        }
      : undefined,
  link: fixed({ icon: 'link', label: 'editorToolbar.link' }),
  image: fixed({ icon: 'image', label: 'editorToolbar.image' }),
  blockquote: fixed({ icon: 'blockquote', label: 'editorToolbar.blockquote' }),
  bulletList: fixed({ icon: 'bulletList', label: 'editorToolbar.bulletList' }),
  orderedList: fixed({ icon: 'orderedList', label: 'editorToolbar.orderedList' }),
  taskList: fixed({ icon: 'taskList', label: 'editorToolbar.taskList' }),
  codeBlock: fixed({ icon: 'codeBlock', label: 'editorToolbar.codeBlock' }),
  horizontalRule: fixed({ icon: 'horizontalRule', label: 'editorToolbar.horizontalRule' }),
  paragraph: fixed({ icon: 'paragraph', label: 'editorToolbar.paragraph' }),
  undo: fixed({ icon: 'undo', label: 'editorToolbar.undo' }),
  redo: fixed({ icon: 'redo', label: 'editorToolbar.redo' }),
  clearFormatting: fixed({ icon: 'clearFormatting', label: 'editorToolbar.clearFormatting' }),
}

/** The built-in icon and name (message key) of a command, when its kind is built in. */
export const getCommandDefaults = (command: EditorCommand) => RESOLVERS[command.kind]?.(command)
