import type { ImageOptions } from '@tiptap/extension-image'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import type { MarkdownExtensionOptions } from '@tiptap/markdown'
import type { StarterKitOptions } from '@tiptap/starter-kit'
import type {
  ChainedCommands,
  Content,
  EditorOptions,
  Extensions,
  FocusPosition,
  Editor as TiptapEditor,
} from '@tiptap/vue-3'
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Editor = typeof theme

/** The format of `v-model`: an HTML string, a tiptap JSON document or a Markdown string. */
export type EditorContentType = 'json' | 'html' | 'markdown'

/** A mark the built-in `mark` handler toggles. */
export type EditorMark = 'bold' | 'italic' | 'strike' | 'code' | 'underline'

/** A text alignment the built-in `textAlign` handler sets. */
export type EditorTextAlign = 'left' | 'center' | 'right' | 'justify'

/** A heading level the built-in `heading` handler toggles. */
export type EditorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** The options the built-in command kinds read. */
type EditorCommandOptions = {
  /** The mark to toggle, for `kind: 'mark'`. */
  mark: EditorMark
  /** The alignment to set, for `kind: 'textAlign'`. */
  align: EditorTextAlign
  /** The heading level to toggle, for `kind: 'heading'`. */
  level: EditorHeadingLevel
  /**
   * The link target, for `kind: 'link'`. A toolbar item without it opens a popover to enter, edit or
   * remove the URL; the handler run without it removes the link at the selection.
   */
  href: string
  /**
   * The image source, for `kind: 'image'`. A toolbar item without it opens a popover to enter the URL; the
   * handler run without it does nothing.
   */
  src: string
}

/** The command a toolbar item runs: its `kind` plus the options that kind reads. */
export type EditorCommand = Partial<EditorCommandOptions> & {
  /** The handler that runs the command, a built-in kind or a key of the `handlers` prop. */
  kind: string
  /** Any option a custom handler reads. */
  [key: string]: unknown
}

/** How a toolbar item reads and runs an editor command. */
export type EditorHandler = {
  /** Whether the command can run on the current selection. */
  canExecute: (editor: TiptapEditor, command?: EditorCommand) => boolean
  /** Builds the command chain; the toolbar calls `.run()` on the result. */
  execute: (editor: TiptapEditor, command?: EditorCommand) => ChainedCommands
  /** Whether the command's state is on at the selection (the toolbar shows it pressed). */
  isActive: (editor: TiptapEditor, command?: EditorCommand) => boolean
  /** Extra condition that disables the item, checked before `canExecute`. */
  isDisabled?: (editor: TiptapEditor, command?: EditorCommand) => boolean
  /** Renders the item as a toggle button with a pressed state instead of a plain button. */
  isToggle?: boolean
}

/** Handlers keyed by command kind. */
export type EditorCustomHandlers = Record<string, EditorHandler>

/** The built-in handler kinds. */
export type EditorHandlerKind =
  | 'mark'
  | 'textAlign'
  | 'heading'
  | 'link'
  | 'image'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'codeBlock'
  | 'horizontalRule'
  | 'paragraph'
  | 'undo'
  | 'redo'
  | 'clearFormatting'

/** The built-in handlers plus the custom ones from the `handlers` prop. */
export type EditorHandlers<H extends EditorCustomHandlers = EditorCustomHandlers> = Record<
  EditorHandlerKind,
  EditorHandler
> &
  H

/** A command item: a built-in kind with the options it needs, or a custom handler key. */
export type EditorItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  | ({ kind: 'mark' } & Pick<EditorCommandOptions, 'mark'>)
  | ({ kind: 'textAlign' } & Pick<EditorCommandOptions, 'align'>)
  | ({ kind: 'heading' } & Pick<EditorCommandOptions, 'level'>)
  | ({ kind: 'link' } & Partial<Pick<EditorCommandOptions, 'href'>>)
  | ({ kind: 'image' } & Partial<Pick<EditorCommandOptions, 'src'>>)
  | {
      kind:
        | 'blockquote'
        | 'bulletList'
        | 'orderedList'
        | 'taskList'
        | 'codeBlock'
        | 'horizontalRule'
        | 'paragraph'
        | 'undo'
        | 'redo'
        | 'clearFormatting'
    }
  | { kind: keyof H & string }

/** Placeholder options, plus where the placeholder shows. */
export type EditorPlaceholderOptions = Partial<PlaceholderOptions> & {
  /**
   * `firstLine`: only on the first line while the whole document is empty.
   * `everyLine`: on every empty line (the current one only, by default).
   * @defaultValue 'everyLine'
   */
  mode?: 'firstLine' | 'everyLine'
}

/** Props of `Editor`: a rich-text field with `v-model`, built on tiptap. */
export type EditorProps<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /**
   * The element or component the root renders as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The document (`v-model`), in the `contentType` format. */
  modelValue?: Content
  /**
   * The format of `v-model`. When not set, strings are read as `html` and objects as `json`.
   * `markdown` adds the Markdown extension, so it is read when the editor is created.
   */
  contentType?: EditorContentType
  /**
   * The surface: `primary` sits on the field background, `secondary` on the default fill.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Editor>['variant']
  /**
   * Options of the starter kit. `false` keeps a plain-text editor: paragraphs, text, hard breaks and
   * history stay; every rich-text node and mark is off. Read when the editor is created.
   * @defaultValue { code: false, horizontalRule: false, link: { openOnClick: false }, dropcursor: { color: 'var(--accent)', width: 2 } }
   */
  starterKit?: boolean | Partial<StarterKitOptions>
  /**
   * Placeholder text of empty lines, or the placeholder extension's options plus `mode`. The text can
   * change at any time; the other options are read when the editor is created.
   * @defaultValue { showOnlyWhenEditable: false, showOnlyCurrent: true, mode: 'everyLine' }
   */
  placeholder?: string | EditorPlaceholderOptions
  /**
   * Options of the Markdown extension, used when `contentType` is `markdown`. Read when the editor is
   * created.
   * @defaultValue { markedOptions: { gfm: true } }
   */
  markdown?: Partial<MarkdownExtensionOptions>
  /**
   * Options of the image extension; `false` leaves it out. Read when the editor is created.
   * @defaultValue true
   */
  image?: boolean | Partial<ImageOptions>
  /** Extra tiptap extensions, added after the built-in ones. Read when the editor is created. */
  extensions?: Extensions
  /** Handlers that override or add command kinds, shared with every toolbar inside the editor. */
  handlers?: H
  /**
   * Whether the document can be edited. `false` keeps it readable and selectable, marked
   * `aria-readonly`.
   * @defaultValue true
   */
  editable?: boolean
  /**
   * Disables the whole field: not editable, dimmed, and toolbar items are disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Where the caret goes on mount; `false` doesn't focus.
   * @defaultValue false
   */
  autofocus?: FocusPosition
  /** ProseMirror editor props, merged over the built-in attributes. */
  editorProps?: EditorOptions['editorProps']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Editor>
}

/** Events emitted by `Editor`. */
export type EditorEmits = {
  /** The document changed; the value is in the `contentType` format. */
  'update:modelValue': [value: Content]
}

/** Props of the `default` and `footer` slots. */
export type EditorSlotProps<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /** The tiptap editor instance. */
  editor: TiptapEditor
  /** The built-in and custom handlers, keyed by command kind. */
  handlers: EditorHandlers<H>
}

/** Slots of `Editor`. */
export type EditorSlots<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /** Rendered above the document, inside the field: usually an `EditorToolbar`. */
  default?: (props: EditorSlotProps<H>) => VNode[]
  /** Rendered below the document, inside the field: status text, counters or a second toolbar. */
  footer?: (props: EditorSlotProps<H>) => VNode[]
}
