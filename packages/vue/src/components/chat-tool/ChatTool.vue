<template>
  <Disclosure
    data-slot="chat-tool"
    :data-state="resolvedState"
    :data-expandable="isExpandable ? 'true' : 'false'"
    :open="isOpen"
    :disabled="disabled || !isExpandable"
    :ui="{
      base: ui.base(),
      heading: ui.heading(),
      content: ui.content(),
      body: ui.body(),
    }"
    @update:open="setOpen"
  >
    <template #trigger="{ indicator }">
      <button
        data-slot="chat-tool-trigger"
        :data-expandable="isExpandable ? 'true' : 'false'"
        :class="ui.trigger()"
      >
        <span :class="ui.label()">
          <component :is="isRunning ? TextShimmer : 'span'" :class="ui.shimmer()">
            <span data-slot="chat-tool-status" :class="ui.status()">
              <slot name="icon" v-bind="slotProps">
                <component :is="statusIcon" :class="ui.statusIcon()" />
              </slot>
            </span>
            <span :class="ui.text()">
              <slot name="label" v-bind="slotProps">
                <span :class="ui.prefix()">{{ resolvedLabel }}</span>
                <span :class="ui.name()">{{ name }}</span>
                <span v-if="suffix" :class="ui.suffix()">{{ suffix }}</span>
              </slot>
            </span>
          </component>
        </span>
        <component :is="indicator" v-if="isExpandable" :class="ui.indicator()" />
      </button>
    </template>
    <template v-if="isExpandable" #default>
      <slot v-bind="slotProps" :open="isOpen">
        <div v-if="resolvedInput !== undefined" data-slot="chat-tool-input" :class="ui.input()">
          <slot name="input" v-bind="slotProps" :input="resolvedInput">
            <div :class="ui.code()">
              <pre
                :class="ui.pre()"
              ><code><span v-for="(token, index) in inputTokens" :key="index" :class="tokenClasses[token.type]">{{ token.text }}</span></code></pre>
            </div>
          </slot>
        </div>
        <div v-if="resolvedOutput !== undefined" data-slot="chat-tool-output" :class="ui.output()">
          <slot name="output" v-bind="slotProps" :output="resolvedOutput">
            <div :class="ui.code()">
              <pre
                :class="ui.pre()"
              ><code><span v-for="(token, index) in outputTokens" :key="index" :class="tokenClasses[token.type]">{{ token.text }}</span></code></pre>
            </div>
          </slot>
        </div>
        <div v-if="hasError" data-slot="chat-tool-error" role="alert" :class="ui.error()">
          <slot name="error" v-bind="slotProps" :error-text="resolvedErrorText">
            {{ resolvedErrorText }}
          </slot>
        </div>
        <div v-if="isAwaitingApproval" data-slot="chat-tool-approval" :class="ui.approval()">
          <slot name="approval" v-bind="slotProps" :approve="approve" :deny="deny">
            <div :class="ui.actions()">
              <Button data-slot="chat-tool-deny" size="sm" variant="secondary" @click="deny">
                {{ t('chatTool.deny') }}
              </Button>
              <Button data-slot="chat-tool-approve" size="sm" variant="primary" @click="approve">
                {{ t('chatTool.approve') }}
              </Button>
            </div>
          </slot>
        </div>
      </slot>
    </template>
  </Disclosure>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import Disclosure from '@/components/disclosure/Disclosure.vue'
import TextShimmer from '@/components/text-shimmer/TextShimmer.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'
import type { ChatToolState } from '@/types/chat'

import type { ChatToolEmits, ChatToolProps, ChatToolSlots } from './ChatTool.types'
import {
  BanIcon,
  CircleCheckIcon,
  CircleExclamationIcon,
  CircleXmarkIcon,
  WrenchIcon,
} from './icons'
import { toJsonText, tokenizeJson } from './json'
import theme from './theme'
import { isToolRunning, toolPartName } from './toolPart'

// `open: undefined` keeps an absent prop uncontrolled instead of Vue's boolean `false`
const props = withDefaults(defineProps<ChatToolProps>(), {
  open: undefined,
  defaultOpen: undefined,
})

const emit = defineEmits<ChatToolEmits>()
const slots = defineSlots<ChatToolSlots>()

const { t } = useLocale()

const resolvedState = computed<ChatToolState>(
  () => props.state ?? props.part?.state ?? 'output-available',
)

const name = computed(() => props.toolName ?? (props.part ? toolPartName(props.part) : ''))
const resolvedInput = computed(() => (props.input === undefined ? props.part?.input : props.input))

const resolvedOutput = computed(() =>
  props.output === undefined ? props.part?.output : props.output,
)

const resolvedErrorText = computed(() => props.errorText ?? props.part?.errorText)

const isRunning = computed(() => isToolRunning(resolvedState.value))
const isAwaitingApproval = computed(() => resolvedState.value === 'approval-requested')

const hasError = computed(
  () => resolvedState.value === 'output-error' && (!!resolvedErrorText.value || !!slots.error),
)

const isExpandable = computed(
  () =>
    !!slots.default ||
    resolvedInput.value !== undefined ||
    resolvedOutput.value !== undefined ||
    hasError.value ||
    isAwaitingApproval.value,
)

const ui = useComponentUI('chatTool', {
  theme,
  variantProps: () => ({ state: resolvedState.value }),
  props,
})

const LABEL_KEYS = {
  'input-streaming': 'chatTool.running',
  'input-available': 'chatTool.running',
  'approval-requested': 'chatTool.approval',
  'approval-responded': 'chatTool.running',
  'output-available': 'chatTool.used',
  'output-error': 'chatTool.failed',
  'output-denied': 'chatTool.denied',
} as const

const STATUS_ICONS = {
  'input-streaming': WrenchIcon,
  'input-available': WrenchIcon,
  'approval-requested': CircleExclamationIcon,
  'approval-responded': WrenchIcon,
  'output-available': CircleCheckIcon,
  'output-error': CircleXmarkIcon,
  'output-denied': BanIcon,
}

const resolvedLabel = computed(() => props.label ?? t(LABEL_KEYS[resolvedState.value]))
const statusIcon = computed(() => STATUS_ICONS[resolvedState.value])
const slotProps = computed(() => ({ name: name.value, state: resolvedState.value }))

// A call waiting for approval opens, so its actions are in reach
const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen ?? isAwaitingApproval.value,
  onUpdate: (open) => emit('update:open', open),
})

watch(isAwaitingApproval, (isAwaiting) => {
  if (isAwaiting) setOpen(true)
})

// Short input stays on one line, the way the model wrote it; output is indented to be read
const inputTokens = computed(() => tokenizeJson(toJsonText(resolvedInput.value, true)))
const outputTokens = computed(() => tokenizeJson(toJsonText(resolvedOutput.value)))

const tokenClasses = computed(() => ({
  key: ui.value.jsonKey(),
  string: ui.value.jsonString(),
  number: ui.value.jsonNumber(),
  punctuation: ui.value.jsonPunctuation(),
  plain: undefined,
}))

const approve = () => emit('approve', props.part?.toolCallId)
const deny = () => emit('deny', props.part?.toolCallId)
</script>
