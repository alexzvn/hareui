<template>
  <Disclosure
    data-slot="chat-tool-group"
    :open="isOpen"
    :disabled="disabled"
    :ui="{
      base: ui.base(),
      heading: ui.heading(),
      content: ui.content(),
      body: ui.body(),
      bodyInner: ui.bodyInner(),
    }"
    @update:open="setOpen"
  >
    <template #trigger="{ indicator }">
      <button data-slot="chat-tool-group-trigger" :class="ui.trigger()">
        <span :class="ui.label()">
          <slot name="label" :count="count" :running="isRunning">
            <TextShimmer v-if="isRunning">{{ resolvedLabel }}</TextShimmer>
            <span v-else>{{ resolvedLabel }}</span>
          </slot>
        </span>
        <component :is="indicator" :class="ui.indicator()" />
      </button>
    </template>
    <slot :open="isOpen">
      <ChatTool
        v-for="part in parts"
        :key="part.toolCallId"
        :part="part"
        @approve="emit('approve', part)"
        @deny="emit('deny', part)"
      />
    </slot>
  </Disclosure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Disclosure from '@/components/disclosure/Disclosure.vue'
import TextShimmer from '@/components/text-shimmer/TextShimmer.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'

import ChatTool from './ChatTool.vue'
import type {
  ChatToolGroupEmits,
  ChatToolGroupProps,
  ChatToolGroupSlots,
} from './ChatToolGroup.types'
import groupTheme from './groupTheme'
import { isToolRunning } from './toolPart'

// `open: undefined` keeps an absent prop uncontrolled instead of Vue's boolean `false`
const props = withDefaults(defineProps<ChatToolGroupProps>(), { open: undefined })
const emit = defineEmits<ChatToolGroupEmits>()
defineSlots<ChatToolGroupSlots>()

const { t } = useLocale()

const count = computed(() => props.parts?.length ?? 0)
const isRunning = computed(() => !!props.parts?.some((part) => isToolRunning(part.state)))

const resolvedLabel = computed(
  () =>
    props.label ??
    t(count.value === 1 ? 'chatTool.call' : 'chatTool.calls', { count: count.value }),
)

const ui = useComponentUI('chatToolGroup', {
  theme: groupTheme,
  variantProps: () => ({}),
  props,
})

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (open) => emit('update:open', open),
})
</script>
