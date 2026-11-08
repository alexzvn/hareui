<template>
  <PromptInput v-model="text" v-model:files="files" class="max-w-xl" @submit="send">
    <template #leading="{ open }">
      <Tooltip :delay="0" text="Attach files">
        <Button aria-label="Attach files" icon-only size="sm" variant="ghost" @click="open">
          <Icon icon="gravity-ui:paperclip" />
        </Button>
      </Tooltip>
      <Select
        v-model="model"
        aria-label="Model"
        variant="secondary"
        :items="models"
        :ui="{ trigger: 'min-h-8 py-1.5' }"
        class="w-36"
      />
    </template>
    <template #footer>AI can make mistakes. Check important info.</template>
  </PromptInput>
</template>

<script setup lang="ts">
import type { SelectValue } from '@hareui/vue'
import { Button, PromptInput, Select, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const text = ref('')
const files = ref<File[]>([])
const model = ref<SelectValue>('swift')

const models = [
  { value: 'swift', label: 'Hare Swift' },
  { value: 'steady', label: 'Hare Steady' },
  { value: 'deep', label: 'Hare Deep' },
]

const send = (prompt: string, attached: File[]) => {
  console.log({ prompt, files: attached, model: model.value })
  text.value = ''
  files.value = []
}
</script>
