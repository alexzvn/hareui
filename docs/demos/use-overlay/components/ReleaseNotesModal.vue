<template>
  <Modal :title="`What's new in ${version}`" class="sm:max-w-md">
    <template #body>
      <ul class="flex list-disc flex-col gap-2 ps-5 text-sm text-muted">
        <li v-for="note in notes" :key="note">{{ note }}</li>
      </ul>
    </template>
    <template #footer>
      <Button @click="emit('close')">Got it</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'

defineProps<{
  version: string
  notes: string[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
