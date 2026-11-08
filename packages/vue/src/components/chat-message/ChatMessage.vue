<template>
  <Primitive
    :as="as"
    data-slot="chat-message"
    :data-role="resolvedRole"
    :data-side="resolvedSide"
    :data-variant="resolvedVariant"
    :class="ui.base()"
  >
    <div v-if="hasLeading" data-slot="chat-message-leading" :class="ui.leading()">
      <slot name="leading" :message="resolvedMessage" :avatar="avatar" :icon="icon">
        <Avatar size="sm" v-bind="avatar" :class="ui.avatar()">
          <template v-if="icon" #fallback>
            <IconRenderer :icon="icon" :class="ui.icon()" />
          </template>
        </Avatar>
      </slot>
    </div>
    <div data-slot="chat-message-body" :class="ui.body()">
      <slot name="header" :message="resolvedMessage" />
      <div data-slot="chat-message-content" :class="ui.content()">
        <slot name="content" :message="resolvedMessage">
          <PartRun
            v-for="run in partRuns"
            :key="run.key"
            :wrapper-class="run.isSources ? ui.sources() : undefined"
          >
            <template v-for="{ part, index } in run.items" :key="`${part.type}-${index}`">
              <slot name="part" :part="part" :index="index" :message="resolvedMessage">
                <slot
                  v-if="part.type === 'text'"
                  name="text"
                  :part="part"
                  :index="index"
                  :message="resolvedMessage"
                >
                  <p data-slot="chat-message-text" :class="ui.text()">{{ part.text }}</p>
                </slot>
                <slot
                  v-else-if="part.type === 'reasoning'"
                  name="reasoning"
                  :part="part"
                  :index="index"
                  :message="resolvedMessage"
                >
                  <ChainOfThought :text="part.text" :streaming="part.state === 'streaming'" />
                </slot>
                <slot
                  v-else-if="isToolPart(part)"
                  name="tool"
                  :part="part"
                  :index="index"
                  :message="resolvedMessage"
                >
                  <ChatTool :part="part" />
                </slot>
                <slot
                  v-else-if="part.type === 'file'"
                  name="file"
                  :part="part"
                  :index="index"
                  :message="resolvedMessage"
                >
                  <ChatAttachment :part="part" />
                </slot>
                <slot
                  v-else-if="part.type === 'source-url' || part.type === 'source-document'"
                  name="source"
                  :part="part"
                  :index="index"
                  :message="resolvedMessage"
                >
                  <ChatSource :part="part" />
                </slot>
              </slot>
            </template>
          </PartRun>
        </slot>
      </div>
      <div v-if="hasActions" data-slot="chat-message-footer" :class="ui.footer()">
        <slot name="actions" :message="resolvedMessage" :actions="actions ?? []">
          <ChatMessageActions
            v-model:feedback="feedback"
            :actions="actions"
            :message="resolvedMessage"
            @action="(action, event) => emit('action', action, event)"
            @copy="(text) => emit('copy', text)"
          />
        </slot>
      </div>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, h } from 'vue'
import type { FunctionalComponent } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import ChainOfThought from '@/components/chain-of-thought/ChainOfThought.vue'
import ChatAttachment from '@/components/chat-attachment/ChatAttachment.vue'
import type { ChatMessageFeedback } from '@/components/chat-message-actions/ChatMessageActions.types'
import ChatMessageActions from '@/components/chat-message-actions/ChatMessageActions.vue'
import ChatSource from '@/components/chat-source/ChatSource.vue'
import ChatTool from '@/components/chat-tool/ChatTool.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import type { ChatMessageData, ChatMessagePart, ChatToolPart } from '@/types/chat'
import { IconRenderer } from '@/utils/icon'

import type { ChatMessageEmits, ChatMessageProps, ChatMessageSlots } from './ChatMessage.types'
import theme from './theme'

const props = withDefaults(defineProps<ChatMessageProps>(), {
  as: 'article',
})

const emit = defineEmits<ChatMessageEmits>()

/** The rating given through the `like` and `dislike` actions. Bind with `v-model:feedback`. */
const feedback = defineModel<ChatMessageFeedback>('feedback', { default: null })
const slots = defineSlots<ChatMessageSlots>()

const resolvedRole = computed(() => props.role ?? props.message?.role ?? 'assistant')
const resolvedParts = computed(() => props.parts ?? props.message?.parts ?? [])

const resolvedMessage = computed<ChatMessageData>(() => ({
  ...props.message,
  id: props.message?.id ?? '',
  role: resolvedRole.value,
  parts: resolvedParts.value,
}))

const isUser = computed(() => resolvedRole.value === 'user')
const resolvedVariant = computed(() => props.variant ?? (isUser.value ? 'secondary' : 'tertiary'))
const resolvedSide = computed(() => props.side ?? (isUser.value ? 'end' : 'start'))

const hasLeading = computed(() => !!(slots.leading || props.avatar || props.icon))
const hasActions = computed(() => !!(slots.actions || props.actions?.length))

type PartRunItem = { part: ChatMessagePart; index: number }

// Consecutive sources share one wrapping row; every other part is a run of its own
const partRuns = computed(() => {
  const runs: { key: string; isSources: boolean; items: PartRunItem[] }[] = []

  resolvedParts.value.forEach((part, index) => {
    const isSources = isSourcePart(part)
    const last = runs.at(-1)

    if (isSources && last?.isSources) {
      last.items.push({ part, index })

      return
    }

    runs.push({ key: `${part.type}-${index}`, isSources, items: [{ part, index }] })
  })

  return runs
})

const isToolPart = (part: ChatMessagePart): part is ChatToolPart =>
  part.type === 'dynamic-tool' || part.type.startsWith('tool-')

const isSourcePart = (part: ChatMessagePart) =>
  part.type === 'source-url' || part.type === 'source-document'

// Wraps a run of sources in their row and leaves other runs unwrapped
const PartRun: FunctionalComponent<{ wrapperClass?: string }> = ({ wrapperClass }, { slots }) =>
  wrapperClass === undefined
    ? slots.default?.()
    : h('div', { 'data-slot': 'chat-message-sources', class: wrapperClass }, slots.default?.())

PartRun.props = ['wrapperClass']

const ui = useComponentUI('chatMessage', {
  theme,
  variantProps: () => ({
    variant: resolvedVariant.value,
    color: props.color,
    compact: props.compact,
    side: resolvedSide.value,
  }),
  props,
})
</script>
