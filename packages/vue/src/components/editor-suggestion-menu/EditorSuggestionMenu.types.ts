import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { VNode } from 'vue'

import type { EditorCustomHandlers, EditorItem } from '@/components/editor/Editor.types'
import type { KbdKey } from '@/components/kbd/kbdKeys'
import type { PortalTarget } from '@/config'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EditorSuggestionMenu = typeof theme

/** The resolved slot class functions of `EditorSuggestionMenu`. */
export type EditorSuggestionMenuUI = ComponentUI<EditorSuggestionMenu>

/** A labelled group of menu entries, rendered as a `role="group"`. */
export type EditorMenuSection<T> = {
  /** Marks the entry as a section. */
  type: 'section'
  /** The section heading, which also labels the group. */
  label?: string
  /** The entries of the section. */
  items: T[]
  /** Additional classes merged into the section. */
  class?: ClassValue
}

/** A line between menu entries. */
export type EditorMenuSeparator = {
  /** Marks the entry as a separator. */
  type: 'separator'
}

/** Any entry of a menu's `items` list: an item, a section or a separator. */
export type EditorMenuEntry<T> = T | EditorMenuSection<T> | EditorMenuSeparator

/** Props shared by `EditorSuggestionMenu` and `EditorMentionMenu`. */
export type EditorMenuProps<T> = {
  /** The editor the menu listens to: the `editor` prop of the `Editor` slots. Read when the menu mounts. */
  editor: TiptapEditor
  /** The character that opens the menu. Read when the menu mounts. */
  char?: string
  /**
   * The entries: items, `{ type: 'section' }` groups and `{ type: 'separator' }` lines. Nested arrays are groups
   * too, split by a line.
   */
  items?: EditorMenuEntry<T>[] | T[][]
  /**
   * The item fields matched against the text typed after the trigger, as names or dotted paths. A field may hold
   * an array of strings, such as aliases. Exact matches rank first, then prefixes, then any match; spaces, `-` and
   * `_` are ignored.
   * @defaultValue ['label']
   */
  filterFields?: string[]
  /**
   * The most items the menu shows.
   * @defaultValue 42
   */
  limit?: number
  /**
   * Shows `items` as they are, without filtering: for results you fetch yourself from `v-model:search-term`.
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /** Shows a spinner row instead of the items, while results load. */
  loading?: boolean
  /**
   * Opens the menu only when the trigger starts a line.
   * @defaultValue false
   */
  startOfLine?: boolean
  /**
   * Keeps the menu open when the typed text has spaces, so `@Leo Ma` still matches `Leo Martins`.
   * @defaultValue false
   */
  allowSpaces?: boolean
  /**
   * The side of the trigger the menu opens on. It flips to the other side when there isn't room.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'bottom'
  /**
   * How the menu lines up with the trigger.
   * @defaultValue 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Distance from the trigger, in pixels.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * Renders the menu in a portal. `true` portals to `document.body`, a selector string or element is used as the
   * teleport target, and `false` renders it in place. Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the menu panel. */
  class?: ClassValue
}

/** Events shared by `EditorSuggestionMenu` and `EditorMentionMenu`. */
export type EditorMenuEmits<T> = {
  /** Emitted after an item is picked and its command ran. */
  select: [item: T]
  /** Emitted when the menu opens or closes (`v-model:open`, read-only). */
  'update:open': [open: boolean]
}

/** The part of an entry that runs: a built-in `kind`, a key of the Editor's `handlers`, or its own `onSelect`. */
type EditorSuggestionMenuCommand<H extends EditorCustomHandlers> =
  | (EditorItem<H> & {
      /** Runs instead of `kind`, after the typed trigger is removed. */
      onSelect?: (editor: TiptapEditor) => void
    })
  | {
      kind?: undefined
      /** Runs after the typed trigger is removed. */
      onSelect: (editor: TiptapEditor) => void
    }

/** An entry that runs an editor command: a built-in `kind`, a key of the Editor's `handlers`, or `onSelect`. */
export type EditorSuggestionMenuItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  EditorSuggestionMenuCommand<H> & {
    type?: undefined
    /** The entry's name, also what the typed text is matched against by default. */
    label: string
    /** Secondary text under the label. */
    description?: string
    /** The icon in the round well before the label: an icon class or a component. */
    icon?: IconValue
    /** Keyboard shortcut shown at the end of the entry (as `<Kbd variant="light">`). */
    kbd?: { keys?: KbdKey | KbdKey[]; content?: string }
    /** Whether the entry can't be picked. */
    disabled?: boolean
    /** Additional classes merged into the entry. */
    class?: ClassValue
    /** Any other field, to match with `filter-fields` or read in slots. */
    [key: string]: unknown
  }

/** Props of `EditorSuggestionMenu`: a slash-command menu that inserts blocks and runs editor commands. */
export type EditorSuggestionMenuProps<
  T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem,
> = EditorMenuProps<T> & {
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EditorSuggestionMenu>
}

/** Events emitted by `EditorSuggestionMenu`. */
export type EditorSuggestionMenuEmits<
  T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem,
> = EditorMenuEmits<T>

/** Props passed to every item slot of `EditorSuggestionMenu`. */
export type EditorSuggestionMenuItemSlotProps<
  T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem,
> = {
  /** The entry being rendered. */
  item: T
  /** Whether the entry is highlighted: Enter or Tab picks it. */
  highlighted: boolean
  /** Whether the entry can't be picked. */
  disabled: boolean
  /** The resolved slot class functions, to style custom content like the default items. */
  ui: EditorSuggestionMenuUI
}

type EditorSuggestionMenuItemSlot<T extends EditorSuggestionMenuItem> = (
  props: EditorSuggestionMenuItemSlotProps<T>,
) => VNode[]

/** Slots shared by `EditorSuggestionMenu` and `EditorMentionMenu`, apart from the item slots. */
export type EditorMenuSlots<T> = {
  /** Replaces the text of a section heading. */
  'section-label'?: (props: { section: EditorMenuSection<T> }) => VNode[]
  /** Replaces the row shown when nothing matches the typed text. */
  empty?: (props: { searchTerm: string }) => VNode[]
}

/** Slots of `EditorSuggestionMenu`. */
export type EditorSuggestionMenuSlots<
  T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem,
> = EditorMenuSlots<T> & {
  /** Replaces the whole content of an entry. */
  item?: EditorSuggestionMenuItemSlot<T>
  /** Replaces the icon well before the label. */
  'item-leading'?: EditorSuggestionMenuItemSlot<T>
  /** Replaces the label text. */
  'item-label'?: EditorSuggestionMenuItemSlot<T>
  /** Replaces the description text. */
  'item-description'?: EditorSuggestionMenuItemSlot<T>
  /** Replaces the content after the label: the entry's `kbd` by default. */
  'item-trailing'?: EditorSuggestionMenuItemSlot<T>
}
