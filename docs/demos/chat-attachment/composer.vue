<template>
  <PromptInput
    v-model="text"
    v-model:files="files"
    accept="image/*,.pdf,.xlsx,.csv,.md"
    placeholder="Ask about the Q3 plan"
    class="max-w-xl"
    @submit="send"
  >
    <template #files="{ remove }">
      <ChatAttachmentGroup :items="items" removable @remove="remove" />
    </template>
  </PromptInput>
</template>

<script setup lang="ts">
import type { ChatAttachmentProps } from '@hareui/vue'
import { ChatAttachmentGroup, PromptInput } from '@hareui/vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'

// Stand-ins for files the user picked earlier, at their real sizes
const placeholder = (name: string, bytes: number) => new File([new Uint8Array(bytes)], name)

const text = ref('')
const files = ref([placeholder('roadmap.pdf', 1_258_291), placeholder('budget.xlsx', 98_304)])

const uploading = reactive(new Set<File>())

const items = computed<ChatAttachmentProps[]>(() =>
  files.value.map((file) => ({ file, status: uploading.has(file) ? 'uploading' : 'idle' })),
)

// Pretend to upload every newly attached file for a couple of seconds
watch(files, (next, previous) => {
  const added = next.filter((file) => !previous.includes(file))

  added.forEach((file) => {
    uploading.add(file)
    setTimeout(() => uploading.delete(file), 2000 + Math.random() * 2000)
  })
})

onMounted(async () => {
  const photo = await fetch('https://picsum.photos/id/20/480/480').then((res) => res.blob())

  files.value = [new File([photo], 'whiteboard.jpg', { type: 'image/jpeg' }), ...files.value]
})

const send = () => {
  text.value = ''
  files.value = []
}
</script>
