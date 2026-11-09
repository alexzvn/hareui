<template>
  <div
    role="group"
    data-slot="chat-message-actions"
    :aria-label="ariaLabel ?? t('chatMessageActions.label')"
    :class="ui.base()"
  >
    <ActionMenu
      v-for="(action, index) in actions"
      :key="getKey(action, index)"
      :items="action.items"
      :disabled="action.disabled"
      :label="getLabel(action)"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        v-bind="getButtonProps(action)"
        icon-only
        data-slot="chat-message-action"
        :data-kind="action.kind"
        :data-copied="isCopiedAction(action) || undefined"
        :aria-label="getLabel(action)"
        :aria-pressed="isPressed(action)"
        :class="ui.action({ override: action.class })"
        @click="onClick(action, $event)"
      >
        <template #default="{ pending }">
          <template v-if="!pending">
            <CopiedIcon v-if="isCopiedAction(action)" :class="ui.icon()" />
            <IconRenderer v-else-if="action.icon" :icon="action.icon" :class="ui.icon()" />
            <component
              :is="getKindIcon(action.kind, isPressed(action))"
              v-else-if="action.kind"
              :class="ui.icon()"
            />
          </template>
        </template>
      </Button>
    </ActionMenu>
    <!-- A focused button's new name isn't announced, so the copy is announced here. -->
    <span role="status" :class="ui.status({ class: 'sr-only' })">{{
      isCopied ? t('chatMessageActions.copied') : ''
    }}</span>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'
import { IconRenderer } from '@/utils/icon'

import { ActionMenu } from './ActionMenu'
import type {
  ChatMessageAction,
  ChatMessageActionKind,
  ChatMessageActionsEmits,
  ChatMessageActionsProps,
  ChatMessageActionsSlots,
  ChatMessageFeedback,
} from './ChatMessageActions.types'
import { CopiedIcon, KIND_ICONS, PRESSED_ICONS } from './icons'
import theme from './theme'

const COPIED_DURATION = 2000

const props = withDefaults(defineProps<ChatMessageActionsProps>(), {
  actions: () => [],
})

const emit = defineEmits<ChatMessageActionsEmits>()

/** The rating of the message. Bind with `v-model:feedback`. */
const feedback = defineModel<ChatMessageFeedback>('feedback', { default: null })
defineSlots<ChatMessageActionsSlots>()

const { t } = useLocale()

const ui = useComponentUI('chatMessageActions', { theme, variantProps: () => ({}), props })

const isCopied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const isCopiedAction = (action: ChatMessageAction) => action.kind === 'copy' && isCopied.value

const getLabel = (action: ChatMessageAction) => {
  if (isCopiedAction(action)) return t('chatMessageActions.copied')

  return action.label ?? (action.kind ? t(`chatMessageActions.${action.kind}`) : undefined)
}

const FEEDBACK_KINDS = new Set<ChatMessageActionKind>(['like', 'dislike'])

const isFeedbackAction = (action: ChatMessageAction) =>
  !!action.kind && FEEDBACK_KINDS.has(action.kind)

const isPressed = (action: ChatMessageAction) => {
  if (action.pressed !== undefined || !isFeedbackAction(action)) return action.pressed

  return feedback.value === action.kind
}

// Keyed by what the action is, so toggling `disabled` or reordering keeps each tooltip mounted
const getKey = (action: ChatMessageAction, index: number) => action.kind ?? action.label ?? index

const getButtonProps = (action: ChatMessageAction) => {
  const {
    kind: _kind,
    label: _label,
    icon: _icon,
    pressed: _pressed,
    items: _items,
    onClick: _onClick,
    class: _class,
    ...rest
  } = action

  return rest
}

const getKindIcon = (kind: ChatMessageActionKind, pressed?: boolean) =>
  (pressed && PRESSED_ICONS[kind]) || KIND_ICONS[kind]

const getText = () =>
  props.text ??
  (props.message?.parts ?? [])
    .flatMap((part) => (part.type === 'text' ? [part.text] : []))
    .join('\n\n')

const copy = async () => {
  const text = getText()

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard missing (insecure context) or denied: nothing was copied, so no copied state.
    return
  }

  emit('copy', text)
  isCopied.value = true
  clearTimeout(copiedTimer)

  copiedTimer = setTimeout(() => {
    isCopied.value = false
  }, COPIED_DURATION)
}

const onClick = (action: ChatMessageAction, event: MouseEvent) => {
  action.onClick?.(event, props.message)
  emit('action', action, event)

  if (isFeedbackAction(action)) {
    feedback.value = feedback.value === action.kind ? null : (action.kind as ChatMessageFeedback)
  }

  if (action.kind === 'copy') void copy()
}

onBeforeUnmount(() => clearTimeout(copiedTimer))
</script>
