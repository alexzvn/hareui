import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type {
  ChatMessageProps,
  ChatMessageSlots,
} from '@/components/chat-message/ChatMessage.types'
import type { ChatMessageData, ChatStatus } from '@/types/chat'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatConversation = typeof theme

/** The resolved slot class functions of `ChatConversation`. */
export type ChatConversationUI = ComponentUI<ChatConversation>

/** The ChatMessage props applied to every message of one role. */
export type ChatConversationRoleProps = Pick<
  ChatMessageProps,
  'avatar' | 'icon' | 'variant' | 'color' | 'compact' | 'side' | 'actions' | 'ui'
>

/** Props of `ChatConversation`: a scrolling log of chat messages that follows new content to the bottom. */
export type ChatConversationProps = {
  /** The messages to render, oldest first. Each one renders as a ChatMessage. */
  messages?: ChatMessageData[]
  /**
   * The state of the chat. `submitted` shows a typing indicator, as does an empty assistant reply while `streaming`.
   * `submitted` and `streaming` mark the log busy and the last message as streaming.
   */
  status?: ChatStatus
  /** The ChatMessage props for user messages. */
  user?: ChatConversationRoleProps
  /** The ChatMessage props for assistant (and system) messages, and the typing indicator (without `actions`). */
  assistant?: ChatConversationRoleProps
  /**
   * Whether the log follows content as it grows (a streaming reply, a new message). It stops once the user scrolls up
   * and resumes when they scroll back to the bottom or press the scroll-to-bottom button.
   * @defaultValue true
   */
  shouldAutoScroll?: boolean
  /**
   * Whether the log starts scrolled to the bottom.
   * @defaultValue true
   */
  shouldScrollToBottom?: boolean
  /**
   * Shows a scroll-to-bottom button while the newest content is out of view. Pass Button props to customize it, and
   * `icon` to change its icon (the gravity-ui `arrow-down` icon by default).
   * @defaultValue true
   */
  scrollButton?: boolean | (Omit<ButtonProps, 'as'> & { icon?: IconValue })
  /** Additional classes merged into the root element, the scroll viewport. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatConversation>
}

/** What `ChatConversation` exposes through a template ref. */
export type ChatConversationExposed = {
  /** Scrolls to the newest content and resumes following it. */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** Scrolls the message with this id to the top of the log and stops following new content. */
  scrollToMessage: (id: string, behavior?: ScrollBehavior) => void
  /** Whether the viewport shows the end of the log. */
  readonly isAtBottom: boolean
}

/** Props of the `#scroll-button` slot. */
export type ChatConversationScrollButtonSlotProps = {
  /** Whether the newest content is out of view, so the button should show. */
  visible: boolean
  /** Scrolls to the bottom and resumes following new content. */
  scrollToBottom: () => void
  /** The resolved slot class functions. */
  ui: ChatConversationUI
}

type MessageSlotProps<K extends keyof ChatMessageSlots> =
  NonNullable<ChatMessageSlots[K]> extends (props: infer P) => VNode[]
    ? P & {
        /** Whether this message is the one being streamed. */
        streaming: boolean
      }
    : never

/** The ChatMessage slots, forwarded to every message with an extra `streaming` slot prop. */
export type ChatConversationMessageSlots = {
  [K in Exclude<keyof ChatMessageSlots, 'default'>]?: (props: MessageSlotProps<K>) => VNode[]
}

/** Slots of `ChatConversation`. Every ChatMessage slot is forwarded to each message. */
export type ChatConversationSlots = ChatConversationMessageSlots & {
  /** Replaces the message list, for custom rendering inside the stick-to-bottom viewport. */
  default?: (props: { messages: ChatMessageData[]; status?: ChatStatus }) => VNode[]
  /** The content of the typing indicator message. Defaults to typing dots. */
  indicator?: () => VNode[]
  /**
   * Content that sticks to the bottom of the log, such as a PromptInput. The last message and the scroll button stay
   * clear of it.
   */
  footer?: (props: { status?: ChatStatus }) => VNode[]
  /** Replaces the scroll-to-bottom button. */
  'scroll-button'?: (props: ChatConversationScrollButtonSlotProps) => VNode[]
}
