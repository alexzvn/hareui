<template>
  <div
    ref="viewport"
    data-slot="chat-conversation"
    role="log"
    :data-status="status"
    :data-footer="slots.footer ? '' : undefined"
    :style="footerHeight ? { '--chat-conversation-footer': `${footerHeight}px` } : undefined"
    :aria-busy="isBusy || undefined"
    :class="ui.base()"
    @scroll.passive="listeners.scroll"
    @wheel.passive="listeners.wheel"
    @touchstart.passive="listeners.touchstart"
    @touchmove.passive="listeners.touchmove"
  >
    <div ref="content" data-slot="chat-conversation-content" :class="ui.content()">
      <slot :messages="messages" :status="status">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :data-message-id="message.id"
          :message="message"
          v-bind="getRoleProps(message)"
          :actions="message === pendingMessage ? undefined : getRoleProps(message)?.actions"
        >
          <template v-for="name in getMessageSlotNames(message)" :key="name" #[name]="slotData">
            <slot :name="name" v-bind="{ ...slotData, streaming: isStreaming(message) }" />
          </template>
          <template v-if="message === pendingMessage" #content>
            <slot name="indicator">
              <ChatLoader />
            </slot>
          </template>
        </ChatMessage>
        <ChatMessage
          v-if="isIndicatorShown"
          data-slot="chat-conversation-indicator"
          role="assistant"
          :parts="[]"
          v-bind="indicatorProps"
        >
          <template #content>
            <slot name="indicator">
              <ChatLoader />
            </slot>
          </template>
        </ChatMessage>
      </slot>
    </div>
    <div
      v-if="scrollButton !== false || slots['scroll-button']"
      data-slot="chat-conversation-scroll-button-container"
      :data-state="isButtonVisible ? 'visible' : 'hidden'"
      :class="ui.scrollButtonContainer()"
    >
      <slot
        name="scroll-button"
        :visible="isButtonVisible"
        :scroll-to-bottom="onScrollButtonClick"
        :ui="ui"
      >
        <Button
          icon-only
          size="sm"
          variant="tertiary"
          :aria-label="t('chatConversation.scrollToBottom')"
          v-bind="buttonProps"
          data-slot="chat-conversation-scroll-button"
          :class="ui.scrollButton()"
          @click="onScrollButtonClick"
        >
          <IconRenderer v-if="buttonIcon" :icon="buttonIcon" class="size-4" />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            class="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.25a.75.75 0 0 1 .75.75v10.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V2A.75.75 0 0 1 8 1.25"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
      </slot>
    </div>
    <div v-if="slots.footer" ref="footer" data-slot="chat-conversation-footer" :class="ui.footer()">
      <slot name="footer" :status="status" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onWatcherCleanup, ref, useTemplateRef, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import ChatLoader from '@/components/chat-loader/ChatLoader.vue'
import ChatMessage from '@/components/chat-message/ChatMessage.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import type { ChatMessageData } from '@/types/chat'
import { IconRenderer } from '@/utils/icon'

import type {
  ChatConversationExposed,
  ChatConversationProps,
  ChatConversationSlots,
} from './ChatConversation.types'
import theme from './theme'
import { useStickToBottom } from './useStickToBottom'

// Space kept above a message scrolled to with `scrollToMessage`, clear of the top fade
const SCROLL_MARGIN = 32

const props = withDefaults(defineProps<ChatConversationProps>(), {
  messages: () => [],
  status: 'ready',
  shouldAutoScroll: true,
  shouldScrollToBottom: true,
  scrollButton: true,
})

const slots = defineSlots<ChatConversationSlots>()
const { t } = useLocale()

const ui = useComponentUI('chatConversation', { theme, variantProps: () => ({}), props })

const viewport = useTemplateRef<HTMLElement>('viewport')
const content = useTemplateRef<HTMLElement>('content')

const footer = useTemplateRef<HTMLElement>('footer')

const { isAtBottom, hasOverflow, scrollToBottom, release, onResize, listeners } = useStickToBottom({
  viewport,
  content,
  shouldFollow: () => props.shouldAutoScroll,
  shouldStartAtBottom: () => props.shouldScrollToBottom,
})

const isBusy = computed(() => props.status === 'submitted' || props.status === 'streaming')

// The AI SDK adds the reply as an empty assistant message until its first token: that message shows the indicator
const pendingMessage = computed(() => {
  const last = props.messages.at(-1)

  if (!isBusy.value || last?.role !== 'assistant' || last.parts.length) return undefined

  return last
})

const isIndicatorShown = computed(() => props.status === 'submitted' && !pendingMessage.value)

// The indicator is not a message yet, so it takes the assistant's look but no actions
const indicatorProps = computed(() => {
  const { actions: _actions, ...rest } = props.assistant ?? {}

  return rest
})

const isButtonVisible = computed(() => hasOverflow.value && !isAtBottom.value)

const buttonOptions = computed(() =>
  typeof props.scrollButton === 'object' ? props.scrollButton : {},
)

const buttonProps = computed(() => {
  const { icon: _icon, ...rest } = buttonOptions.value

  return rest
})

const buttonIcon = computed(() => buttonOptions.value.icon)

// Only the last message streams, and nothing does once the chat is stopped
const isStreaming = (message: ChatMessageData) =>
  isBusy.value && message.id === props.messages.at(-1)?.id

const getRoleProps = (message: ChatMessageData) =>
  message.role === 'user' ? props.user : props.assistant

const OWN_SLOTS = new Set(['default', 'indicator', 'scroll-button', 'footer'])
const PENDING_SLOTS = new Set(['content', 'actions'])

// The pending message renders the indicator, so its content and actions slots are left out
const getMessageSlotNames = (message: ChatMessageData) =>
  Object.keys(slots).filter(
    (name) =>
      !OWN_SLOTS.has(name) && (message !== pendingMessage.value || !PENDING_SLOTS.has(name)),
  ) as 'part'[]

const scrollToMessage = (id: string, behavior: ScrollBehavior = 'smooth') => {
  const el = viewport.value
  const target = content.value?.querySelector(`[data-message-id="${CSS.escape(id)}"]`)

  if (!el || !target) return

  const offset = target.getBoundingClientRect().top - el.getBoundingClientRect().top

  release()
  el.scrollTo({ top: el.scrollTop + offset - SCROLL_MARGIN, behavior })
}

// The footer overlays the log while it sticks, so its height lifts the scroll button above it
const footerHeight = ref(0)

const measureFooter = () => {
  footerHeight.value = footer.value?.offsetHeight ?? 0
  onResize()
}

watch(
  footer,
  (el) => {
    measureFooter()

    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(measureFooter)

    observer.observe(el)
    onWatcherCleanup(() => observer.disconnect())
  },
  { flush: 'post' },
)

const onScrollButtonClick = () => scrollToBottom('smooth')

// Sending a message brings the reply into view, even after the user scrolled up
watch(
  () => props.status,
  (status) => {
    if (status === 'submitted') scrollToBottom()
  },
  { flush: 'post' },
)

// Covers changes that don't resize the observed elements, and environments without ResizeObserver
watch(
  () => [props.messages, props.messages.length, props.messages.at(-1)?.parts.length],
  onResize,
  { flush: 'post' },
)

defineExpose<ChatConversationExposed>({
  scrollToBottom,
  scrollToMessage,
  get isAtBottom() {
    return isAtBottom.value
  },
})
</script>
