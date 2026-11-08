import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DropdownEntry, DropdownItem } from '@/components/dropdown/Dropdown.types'
import type { ChatMessageData } from '@/types/chat'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatMessageActions = typeof theme

/**
 * A built-in action, which brings an icon and a label: `copy` (copies the message text), `like`, `dislike`,
 * `regenerate`, `edit`, `share` and `more`.
 */
export type ChatMessageActionKind =
  | 'copy'
  | 'like'
  | 'dislike'
  | 'regenerate'
  | 'edit'
  | 'share'
  | 'more'

/** The rating a message got through its `like` and `dislike` buttons. */
export type ChatMessageFeedback = 'like' | 'dislike' | null

/**
 * A button of `ChatMessageActions`. Other Button props (`variant`, `pending`, `to`, …) pass through to the button.
 */
export type ChatMessageAction = Omit<
  ButtonProps,
  'onClick' | 'iconOnly' | 'label' | 'leadingIcon' | 'trailingIcon' | 'avatar'
> & {
  /**
   * A built-in action. Its icon and label become the defaults; `copy` also writes the message text to the clipboard
   * and shows a check for two seconds. `like` and `dislike` set `v-model:feedback`.
   */
  kind?: ChatMessageActionKind
  /** The accessible name and tooltip text. Defaults to the label of `kind`. */
  label?: string
  /** The icon, in place of the icon of `kind`. */
  icon?: IconValue
  /**
   * Marks a toggle button as pressed (`aria-pressed`). A pressed `like` or `dislike` shows a filled icon. They follow
   * `v-model:feedback` unless you set it.
   */
  pressed?: boolean
  /** Opens a menu of these entries from the button, such as for a `more` action. The button then has no tooltip. */
  items?: DropdownEntry<DropdownItem>[]
  /** Called on click with the message the actions belong to. */
  onClick?: (event: MouseEvent, message?: ChatMessageData) => void
}

/** Props of `ChatMessageActions`. */
export type ChatMessageActionsProps = {
  /** The buttons, in order. */
  actions?: ChatMessageAction[]
  /** The message the actions belong to. `copy` copies its text parts, and `onClick` receives it. */
  message?: ChatMessageData
  /** The text `copy` writes to the clipboard, in place of the text parts of `message`. */
  text?: string
  /**
   * The accessible name of the group.
   * @defaultValue 'Message actions' (locale `chatMessageActions.label`)
   */
  ariaLabel?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatMessageActions>
}

/** Emits of `ChatMessageActions`. */
export type ChatMessageActionsEmits = {
  /** A button was clicked. */
  action: [action: ChatMessageAction, event: MouseEvent]
  /** A `copy` button wrote this text to the clipboard. */
  copy: [text: string]
  /**
   * The rating changed (`v-model:feedback`, default `null`). A `like` or `dislike` press sets it; pressing the same one
   * again clears it.
   */
  'update:feedback': [feedback: ChatMessageFeedback]
}

/** Slots of `ChatMessageActions`. */
export type ChatMessageActionsSlots = {
  /** Content after the buttons, such as a menu. */
  default?: () => VNode[]
}
