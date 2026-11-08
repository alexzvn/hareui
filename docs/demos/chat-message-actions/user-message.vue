<template>
  <div class="w-full max-w-lg">
    <form v-if="isEditing" class="flex flex-col items-end gap-2" @submit.prevent="save">
      <TextArea v-model="draft" aria-label="Edit message" :rows="3" class="w-full" />
      <div class="flex gap-2">
        <Button size="sm" variant="tertiary" @click="isEditing = false">Cancel</Button>
        <Button size="sm" type="submit">Send</Button>
      </div>
    </form>
    <ChatMessage v-else :message="message">
      <template #actions>
        <ChatMessageActions :actions="actions" :message="message" />
      </template>
    </ChatMessage>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageAction, ChatMessageData } from '@hareui/vue'
import { Button, ChatMessage, ChatMessageActions, TextArea } from '@hareui/vue'
import { computed, ref } from 'vue'

const text = ref(
  'Plan a two-day hike near Innsbruck for early October, with one night in a mountain hut.',
)

const draft = ref('')
const isEditing = ref(false)

const message = computed<ChatMessageData>(() => ({
  id: 'hike',
  role: 'user',
  parts: [{ type: 'text', text: text.value }],
}))

const actions: ChatMessageAction[] = [
  {
    kind: 'edit',
    onClick: () => {
      draft.value = text.value
      isEditing.value = true
    },
  },
  { kind: 'copy' },
]

const save = () => {
  text.value = draft.value.trim() || text.value
  isEditing.value = false
}
</script>
