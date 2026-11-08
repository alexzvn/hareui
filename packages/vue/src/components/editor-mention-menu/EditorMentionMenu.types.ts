import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type {
  EditorMenuEmits,
  EditorMenuProps,
  EditorMenuSlots,
} from '@/components/editor-suggestion-menu/EditorSuggestionMenu.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EditorMentionMenu = typeof theme

/** The resolved slot class functions of `EditorMentionMenu`. */
export type EditorMentionMenuUI = ComponentUI<EditorMentionMenu>

/** Someone or something to mention. */
export type EditorMentionMenuItem = {
  type?: undefined
  /** The name shown in the menu and in the mention, also what the typed text is matched against by default. */
  label: string
  /** Stored as the mention's `id`. Defaults to `label`. */
  id?: string
  /** Secondary text under the label. */
  description?: string
  /** The round avatar before the label. Without `avatar` and `icon`, it shows the label's initials. */
  avatar?: AvatarProps
  /** The icon in the round well before the label, instead of the avatar: an icon class or a component. */
  icon?: IconValue
  /** Whether the entry can't be picked. */
  disabled?: boolean
  /** Additional classes merged into the entry. */
  class?: ClassValue
  /** Any other field, to match with `filter-fields` or read in slots. */
  [key: string]: unknown
}

/** Props of `EditorMentionMenu`: inserts an inline mention, `@name` by default, at the trigger character. */
export type EditorMentionMenuProps<T extends EditorMentionMenuItem = EditorMentionMenuItem> =
  EditorMenuProps<T> & {
    /** Per-slot class overrides. */
    ui?: ComponentSlots<EditorMentionMenu>
  }

/** Events emitted by `EditorMentionMenu`. */
export type EditorMentionMenuEmits<T extends EditorMentionMenuItem = EditorMentionMenuItem> =
  EditorMenuEmits<T>

/** Props passed to every item slot of `EditorMentionMenu`. */
export type EditorMentionMenuItemSlotProps<
  T extends EditorMentionMenuItem = EditorMentionMenuItem,
> = {
  /** The entry being rendered. */
  item: T
  /** Whether the entry is highlighted: Enter or Tab picks it. */
  highlighted: boolean
  /** Whether the entry can't be picked. */
  disabled: boolean
  /** The resolved slot class functions, to style custom content like the default items. */
  ui: EditorMentionMenuUI
}

type EditorMentionMenuItemSlot<T extends EditorMentionMenuItem> = (
  props: EditorMentionMenuItemSlotProps<T>,
) => VNode[]

/** Slots of `EditorMentionMenu`. */
export type EditorMentionMenuSlots<T extends EditorMentionMenuItem = EditorMentionMenuItem> =
  EditorMenuSlots<T> & {
    /** Replaces the whole content of an entry. */
    item?: EditorMentionMenuItemSlot<T>
    /** Replaces the avatar or icon before the label. */
    'item-leading'?: EditorMentionMenuItemSlot<T>
    /** Replaces the label text. */
    'item-label'?: EditorMentionMenuItemSlot<T>
    /** Replaces the description text. */
    'item-description'?: EditorMentionMenuItemSlot<T>
    /** Content after the label. */
    'item-trailing'?: EditorMentionMenuItemSlot<T>
  }
