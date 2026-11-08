<template>
  <div data-slot="chat-attachment-group" :class="ui.base()">
    <slot>
      <ChatAttachment
        v-for="(entry, index) in entries"
        :key="entry.key"
        v-bind="entry.attachment"
        :variant="entry.attachment.variant ?? variant"
        :removable="entry.attachment.removable ?? removable"
        @remove="emit('remove', index, entry.item)"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import type { ChatFilePart } from '@/types/chat'

import type { ChatAttachmentProps } from './ChatAttachment.types'
import ChatAttachment from './ChatAttachment.vue'
import type {
  ChatAttachmentGroupEmits,
  ChatAttachmentGroupProps,
  ChatAttachmentGroupSlots,
} from './ChatAttachmentGroup.types'
import groupTheme from './groupTheme'

const props = defineProps<ChatAttachmentGroupProps>()
const emit = defineEmits<ChatAttachmentGroupEmits>()
defineSlots<ChatAttachmentGroupSlots>()

type Entry = {
  key: string
  attachment: ChatAttachmentProps
  item: ChatFilePart | File | ChatAttachmentProps
}

const entries = computed<Entry[]>(() => [
  ...(props.parts ?? []).map((part, index) => ({
    key: `part-${index}-${part.url}`,
    attachment: { part },
    item: part,
  })),
  ...(props.files ?? []).map((file, index) => ({
    key: `file-${index}-${file.name}`,
    attachment: { file },
    item: file,
  })),
  ...(props.items ?? []).map((item, index) => ({
    key: `item-${index}-${item.name ?? item.file?.name ?? item.part?.url ?? item.url}`,
    attachment: item,
    item,
  })),
])

const ui = useComponentUI('chatAttachmentGroup', {
  theme: groupTheme,
  variantProps: () => ({}),
  props,
})
</script>
