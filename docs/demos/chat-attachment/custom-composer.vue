<template>
  <ChatAttachmentInput
    v-slot="{ open, isDragging }"
    accept="image/*,.pdf,.xlsx,.csv,.md"
    class="w-full max-w-xl"
    @select="attach"
  >
    <form
      class="relative flex flex-col rounded-3xl border border-field-border bg-field shadow-field transition-colors focus-within:border-field-border-focus"
      @submit.prevent="send"
    >
      <ChatAttachmentGroup
        v-if="files.length"
        :files="files"
        removable
        class="px-3 pt-3"
        @remove="remove"
      />
      <textarea
        v-model="text"
        rows="2"
        aria-label="Message"
        placeholder="Ask about the Q3 plan, or drop files here"
        class="w-full resize-none bg-transparent px-4 pt-3 text-sm text-field-foreground outline-none placeholder:text-field-placeholder"
      />
      <div class="flex items-center justify-between gap-2 p-3">
        <Button aria-label="Attach files" icon-only size="sm" variant="ghost" @click="open">
          <Icon icon="gravity-ui:paperclip" />
        </Button>
        <Button
          type="submit"
          aria-label="Send"
          icon-only
          size="sm"
          :disabled="!text.trim() && !files.length"
        >
          <Icon icon="gravity-ui:arrow-up" />
        </Button>
      </div>
      <div
        v-if="isDragging"
        class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl border-2 border-dashed border-accent bg-accent-soft text-sm font-medium text-accent-soft-foreground"
      >
        Drop to attach
      </div>
    </form>
  </ChatAttachmentInput>
</template>

<script setup lang="ts">
import { Button, ChatAttachmentGroup, ChatAttachmentInput } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const text = ref('')
const files = ref<File[]>([])

const attach = (picked: File[]) => {
  files.value = [...files.value, ...picked]
}

const remove = (index: number) => {
  files.value = files.value.filter((_, i) => i !== index)
}

const send = () => {
  console.log({ prompt: text.value, files: files.value })
  text.value = ''
  files.value = []
}
</script>
