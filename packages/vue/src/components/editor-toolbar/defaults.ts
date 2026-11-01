import type { EditorCommand } from '@/components/editor/Editor.types'
import type { TranslateParams } from '@/composables/useLocale'
import type { MessageKey } from '@/locale/defineLocale'

import type { EditorToolbarIconName } from './icons'

/** `labelKey` is the message key of the command's name, `params` fill its placeholders. */
type CommandDefaults = {
  icon: EditorToolbarIconName
  labelKey: MessageKey
  params?: TranslateParams
}

type CommandDefaultsResolver = (command: EditorCommand) => CommandDefaults | undefined

const MARKS: Record<string, CommandDefaults> = {
  bold: { icon: 'bold', labelKey: 'editorToolbar.bold' },
  italic: { icon: 'italic', labelKey: 'editorToolbar.italic' },
  underline: { icon: 'underline', labelKey: 'editorToolbar.underline' },
  strike: { icon: 'strike', labelKey: 'editorToolbar.strike' },
  code: { icon: 'code', labelKey: 'editorToolbar.code' },
}

const ALIGNMENTS: Record<string, CommandDefaults> = {
  left: { icon: 'alignLeft', labelKey: 'editorToolbar.alignLeft' },
  center: { icon: 'alignCenter', labelKey: 'editorToolbar.alignCenter' },
  right: { icon: 'alignRight', labelKey: 'editorToolbar.alignRight' },
  justify: { icon: 'alignJustify', labelKey: 'editorToolbar.alignJustify' },
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
          labelKey: 'editorToolbar.heading',
          params: { level: command.level },
        }
      : undefined,
  link: fixed({ icon: 'link', labelKey: 'editorToolbar.link' }),
  image: fixed({ icon: 'image', labelKey: 'editorToolbar.image' }),
  blockquote: fixed({ icon: 'blockquote', labelKey: 'editorToolbar.blockquote' }),
  bulletList: fixed({ icon: 'bulletList', labelKey: 'editorToolbar.bulletList' }),
  orderedList: fixed({ icon: 'orderedList', labelKey: 'editorToolbar.orderedList' }),
  taskList: fixed({ icon: 'taskList', labelKey: 'editorToolbar.taskList' }),
  codeBlock: fixed({ icon: 'codeBlock', labelKey: 'editorToolbar.codeBlock' }),
  horizontalRule: fixed({ icon: 'horizontalRule', labelKey: 'editorToolbar.horizontalRule' }),
  paragraph: fixed({ icon: 'paragraph', labelKey: 'editorToolbar.paragraph' }),
  undo: fixed({ icon: 'undo', labelKey: 'editorToolbar.undo' }),
  redo: fixed({ icon: 'redo', labelKey: 'editorToolbar.redo' }),
  clearFormatting: fixed({ icon: 'clearFormatting', labelKey: 'editorToolbar.clearFormatting' }),
}

/** The built-in icon and name (message key) of a command, when its kind is built in. */
export const getCommandDefaults = (command: EditorCommand) => RESOLVERS[command.kind]?.(command)
