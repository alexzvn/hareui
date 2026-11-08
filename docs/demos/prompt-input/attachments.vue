<template>
  <PromptInput
    v-model="text"
    v-model:files="files"
    accept="image/*,.pdf,.txt,.md"
    placeholder="Ask about your files"
    class="max-w-xl"
    @submit="send"
  >
    <template #footer>Drop, paste or attach images and documents.</template>
  </PromptInput>
</template>

<script setup lang="ts">
import { PromptInput } from '@hareui/vue'
import { onMounted, ref } from 'vue'

const text = ref('Does the new logo work next to the numbers in this report?')

const files = ref<File[]>([
  new File([new Uint8Array(248_000)], 'quarterly-report.pdf', { type: 'application/pdf' }),
])

// Attach an image the docs site serves, so it shows a real thumbnail
onMounted(async () => {
  const response = await fetch('/logo.svg')
  const logo = new File([await response.blob()], 'logo.svg', { type: 'image/svg+xml' })
  files.value = [logo, ...files.value]
})

const send = (prompt: string, attached: File[]) => {
  console.log({ prompt, files: attached })
  text.value = ''
  files.value = []
}
</script>
