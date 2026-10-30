<template>
  <Modal :title="progress < 100 ? 'Exporting report' : 'Export ready'" class="sm:max-w-sm">
    <template #body>
      <ProgressBar class="w-full" :label="fileName" :value="progress" />
    </template>
    <template #footer>
      <Button :disabled="progress < 100" @click="emit('close')">Download</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal, ProgressBar } from '@hareui/vue'

defineProps<{
  fileName: string
  progress: number
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
