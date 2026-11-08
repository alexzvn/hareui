<template>
  <div
    data-slot="chat-attachment-input"
    :data-dragging="isDragging ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    v-bind="dropzone"
    @paste="onPaste"
  >
    <slot :open="open" :is-dragging="isDragging" />
  </div>
</template>

<script setup lang="ts">
import type {
  ChatAttachmentInputEmits,
  ChatAttachmentInputProps,
  ChatAttachmentInputSlots,
} from './ChatAttachmentInput.types'
import { useChatAttachmentInput } from './useChatAttachmentInput'

const props = withDefaults(defineProps<ChatAttachmentInputProps>(), { multiple: true })
const emit = defineEmits<ChatAttachmentInputEmits>()
defineSlots<ChatAttachmentInputSlots>()

const { open, isDragging, dropzone, onPaste } = useChatAttachmentInput({
  accept: () => props.accept,
  multiple: () => props.multiple,
  disabled: () => props.disabled,
  onSelect: (files) => emit('select', files),
})

defineExpose({ open })
</script>
