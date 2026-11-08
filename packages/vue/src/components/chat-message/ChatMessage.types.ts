import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type {
  ChatMessageAction,
  ChatMessageFeedback,
} from '@/components/chat-message-actions/ChatMessageActions.types'
import type {
  ChatFilePart,
  ChatMessageData,
  ChatMessagePart,
  ChatReasoningPart,
  ChatRole,
  ChatSourceDocumentPart,
  ChatSourceUrlPart,
  ChatTextPart,
  ChatToolPart,
} from '@/types/chat'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatMessage = typeof theme

/** Props of `ChatMessage`. */
export type ChatMessageProps = {
  /** The message to render. `role` and `parts` override its fields. */
  message?: ChatMessageData
  /**
   * Who wrote the message. It picks the default `variant` and `side`. Without it or `message`, the message is an
   * assistant message.
   * @defaultValue `message.role`, else `'assistant'`
   */
  role?: ChatRole
  /**
   * The content, in order.
   * @defaultValue `message.parts`
   */
  parts?: ChatMessagePart[]
  /**
   * The element or component the root renders as.
   * @defaultValue 'article'
   */
  as?: PrimitiveProps['as']
  /** Shows an avatar before the content. */
  avatar?: AvatarProps
  /** Shows this icon in the avatar, or in an avatar of its own without `avatar`. */
  icon?: IconValue
  /**
   * The look of the content: a bubble (`primary`, `secondary`, `soft`, `outline`) or no bubble (`tertiary`).
   * @defaultValue `'secondary'` for user messages, else `'tertiary'`
   */
  variant?: ComponentVariants<ChatMessage>['variant']
  /**
   * The colour of the content. With `primary`, `default` is the inverted solid (foreground background).
   * @defaultValue 'default'
   */
  color?: ComponentVariants<ChatMessage>['color']
  /**
   * A denser message for drawers and palettes: a smaller avatar, tighter spacing, and no free space after the content.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * The side the message sits on. `end` puts the avatar after the content and aligns the content to the end.
   * @defaultValue `'end'` for user messages, else `'start'`
   */
  side?: ComponentVariants<ChatMessage>['side']
  /** Buttons under the content, such as copy and regenerate. */
  actions?: ChatMessageAction[]
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatMessage>
}

/** Emits of `ChatMessage`. */
export type ChatMessageEmits = {
  /** An action button was clicked. */
  action: [action: ChatMessageAction, event: MouseEvent]
  /** A `copy` action wrote this text to the clipboard. */
  copy: [text: string]
  /** The rating changed through a `like` or `dislike` action (`v-model:feedback`, default `null`). */
  'update:feedback': [feedback: ChatMessageFeedback]
}

/** Props of every `ChatMessage` slot. */
export type ChatMessageSlotProps = {
  /** The message, with `role` and `parts` applied. */
  message: ChatMessageData
}

/** Props of the part slots of `ChatMessage`. */
export type ChatMessagePartSlotProps<P extends ChatMessagePart = ChatMessagePart> =
  ChatMessageSlotProps & {
    /** The part to render. */
    part: P
    /** The position of the part in `parts`. */
    index: number
  }

/** Slots of `ChatMessage`. */
export type ChatMessageSlots = {
  /** Replaces the avatar. Shows when it's filled, or when `avatar` or `icon` is set. */
  leading?: (props: ChatMessageSlotProps & { avatar?: AvatarProps; icon?: IconValue }) => VNode[]
  /** Content above the parts, such as the author's name. */
  header?: (props: ChatMessageSlotProps) => VNode[]
  /** Replaces the rendering of every part, such as with a typing indicator. */
  content?: (props: ChatMessageSlotProps) => VNode[]
  /**
   * Renders any part. A part it renders nothing for falls back to the slot of its type, so it can handle some parts
   * and leave the rest.
   */
  part?: (props: ChatMessagePartSlotProps) => VNode[]
  /** Renders a text part, such as with a Markdown renderer. Without it, the text shows as is. */
  text?: (props: ChatMessagePartSlotProps<ChatTextPart>) => VNode[]
  /** Renders a reasoning part. Defaults to a ChainOfThought. */
  reasoning?: (props: ChatMessagePartSlotProps<ChatReasoningPart>) => VNode[]
  /** Renders a tool call (`tool-*` and `dynamic-tool` parts). Defaults to a ChatTool. */
  tool?: (props: ChatMessagePartSlotProps<ChatToolPart>) => VNode[]
  /** Renders a file part. Defaults to a ChatAttachment. */
  file?: (props: ChatMessagePartSlotProps<ChatFilePart>) => VNode[]
  /** Renders a source (`source-url` and `source-document` parts). Defaults to a ChatSource. */
  source?: (props: ChatMessagePartSlotProps<ChatSourceUrlPart | ChatSourceDocumentPart>) => VNode[]
  /** Replaces the action buttons. Shows when it's filled, or when `actions` is set. */
  actions?: (props: ChatMessageSlotProps & { actions: ChatMessageAction[] }) => VNode[]
}
