import type { VNode } from 'vue'

import type {
  EditorMentionMenuItem,
  EditorMentionMenuItemSlotProps,
  EditorMentionMenuProps,
  EditorMenuEntry,
} from '@/components/editor-mention-menu'
import type {
  PromptInputEmits,
  PromptInputExposed,
  PromptInputProps,
  PromptInputSlots,
} from '@/components/prompt-input'

/** A character that opens a menu of tokens in `PromptInputEditor`, such as `@` for people or `/` for commands. */
export type PromptInputEditorTrigger = Pick<
  EditorMentionMenuProps,
  'filterFields' | 'limit' | 'ignoreFilter' | 'loading'
> & {
  /** The character that opens the menu. */
  char: string
  /** The entries: items, `{ type: 'section' }` groups and `{ type: 'separator' }` lines. Nested arrays are groups too. */
  items: EditorMenuEntry<EditorMentionMenuItem>[] | EditorMentionMenuItem[][]
  /**
   * Called with the text typed after the character while the menu is open, to fetch `items` yourself. Pair it with
   * `ignoreFilter`.
   */
  onSearch?: (searchTerm: string) => void
}

/** A token of the prompt, picked from a trigger's menu. */
export type PromptInputEditorToken = {
  /** The trigger character the token was picked with, such as `@`. */
  char: string
  /** The `id` of the picked entry, or its label when it has none. */
  id: string
  /** The label of the picked entry, shown after the character. */
  label: string
}

/**
 * Props of `PromptInputEditor`, a `PromptInput` whose text holds inline tokens (mentions, commands) picked from a
 * menu. `v-model` is the plain text: each token reads as its character and label, such as `@sarah`. Text set
 * through `v-model` turns `@sarah` back into a token when `sarah` is the label of an entry of the `@` trigger.
 */
export type PromptInputEditorProps = PromptInputProps & {
  /** The characters that open a token menu, with their entries. */
  triggers?: PromptInputEditorTrigger[]
}

/** Events emitted by `PromptInputEditor`. */
export type PromptInputEditorEmits = Omit<PromptInputEmits, 'submit'> & {
  /**
   * Emitted when the prompt is sent (Enter or the send button) while `status` is `ready` or `error`, with its text,
   * files and tokens in the order they appear. Clear `v-model` and `v-model:files` yourself once the message is on
   * its way.
   */
  submit: [text: string, files: File[], tokens: PromptInputEditorToken[]]
}

/** Props of the `item` slot of `PromptInputEditor`. */
export type PromptInputEditorItemSlotProps = EditorMentionMenuItemSlotProps & {
  /** The character of the trigger whose menu shows the entry. */
  char: string
}

/** Slots of `PromptInputEditor`: the slots of `PromptInput`, without `body`, and the menu's `item` slot. */
export type PromptInputEditorSlots = Omit<PromptInputSlots, 'body'> & {
  /** Replaces the whole content of a menu entry, in every trigger's menu. */
  item?: (props: PromptInputEditorItemSlotProps) => VNode[]
}

/** What a template ref on `PromptInputEditor` exposes. */
export type PromptInputEditorExposed = PromptInputExposed
