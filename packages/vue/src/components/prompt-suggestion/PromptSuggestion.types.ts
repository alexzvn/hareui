import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type PromptSuggestion = typeof theme

/** The resolved slot class functions of `PromptSuggestion`. */
export type PromptSuggestionUI = ComponentUI<PromptSuggestion>

/** A suggested prompt. A plain string in `items` is the same as `{ label: string }`. */
export type PromptSuggestionItem = {
  /** The text on the suggestion. Also what `select` sends when `prompt` isn't set. */
  label: string
  /** The prompt `select` sends, when it differs from the label (a longer instruction behind a short label). */
  prompt?: string
  /** Secondary text under the label. */
  description?: string
  /** The icon before the label: an icon class or a component. */
  icon?: IconValue
  /** Small text in the footer of a card, such as a category or an estimate. */
  meta?: string
  /** Short tags in the footer of a card. */
  tags?: string[]
  /** Whether the suggestion can't be picked. */
  disabled?: boolean
  /**
   * Name of the slots that render this item instead of the `item-*` ones: `#{slot}`, `#{slot}-leading`,
   * `#{slot}-label`, `#{slot}-description`, `#{slot}-trailing` and `#{slot}-footer`.
   */
  slot?: string
  /** Additional classes merged into this item's button. */
  class?: ClassValue
}

/** A titled group of suggestions. */
export type PromptSuggestionGroup<T extends PromptSuggestionItem = PromptSuggestionItem> = {
  /** The group's heading. */
  label?: string
  /** Text under the group's heading. */
  description?: string
  /** The suggestions in the group. */
  items: (T | string)[]
}

/** Props of `PromptSuggestion`: suggested prompts for an empty chat or next to a prompt input. */
export type PromptSuggestionProps<T extends PromptSuggestionItem = PromptSuggestionItem> = {
  /** The suggestions, as strings or items. Rendered before `groups`. */
  items?: (T | string)[]
  /** Suggestions split into titled groups. */
  groups?: PromptSuggestionGroup<T>[]
  /** Heading above the suggestions. */
  title?: string
  /** Text under the heading. */
  description?: string
  /** `pill`: outlined rows, one or two per line. `card`: surface cards, up to three per line. */
  variant?: ComponentVariants<PromptSuggestion>['variant']
  /**
   * Icon at the end of each pill, shown on hover and keyboard focus. `false` hides it. Cards have none.
   * Defaults to the gravity-ui `chevron-right` icon.
   */
  trailingIcon?: IconValue | false
  /** Whether every suggestion is disabled, e.g. while a response is streaming. */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<PromptSuggestion>
}

/** Events emitted by `PromptSuggestion`. */
export type PromptSuggestionEmits<T extends PromptSuggestionItem = PromptSuggestionItem> = {
  /** Emitted when a suggestion is picked, with its `prompt` (or `label`) and the item. */
  select: [prompt: string, item: T]
}

/** Props passed to every item slot. */
export type PromptSuggestionItemSlotProps<T extends PromptSuggestionItem = PromptSuggestionItem> = {
  /** The item being rendered; a string from `items` arrives as `{ label }`. */
  item: T
  /** Whether the item is disabled. */
  disabled: boolean
  /** The resolved slot class functions, to style custom content like the default items. */
  ui: PromptSuggestionUI
}

type PromptSuggestionItemSlot<T extends PromptSuggestionItem> = (
  props: PromptSuggestionItemSlotProps<T>,
) => VNode[]

/** Slots of `PromptSuggestion`. Items with a `slot` field use `#{slot}`, `#{slot}-leading`, … instead of `item-*`. */
export type PromptSuggestionSlots<T extends PromptSuggestionItem = PromptSuggestionItem> = {
  /** Replaces the heading and its description. */
  header?: () => VNode[]
  /** Replaces the heading text. */
  title?: () => VNode[]
  /** Replaces the text under the heading. */
  description?: () => VNode[]
  /** Replaces a group's heading and description. */
  'group-header'?: (props: { group: PromptSuggestionGroup<T> }) => VNode[]
  /** Replaces the whole content of an item's button. */
  item?: PromptSuggestionItemSlot<T>
  /** Replaces the icon before the label. */
  'item-leading'?: PromptSuggestionItemSlot<T>
  /** Replaces the label text. */
  'item-label'?: PromptSuggestionItemSlot<T>
  /** Replaces the description text. */
  'item-description'?: PromptSuggestionItemSlot<T>
  /** Replaces the icon at the end of a pill. */
  'item-trailing'?: PromptSuggestionItemSlot<T>
  /** Replaces the footer of a card: `meta` and `tags`. */
  'item-footer'?: PromptSuggestionItemSlot<T>
  /** The slots named by items' `slot` field. */
  [slot: string]: PromptSuggestionItemSlot<T> | ((props: never) => VNode[]) | undefined
}
