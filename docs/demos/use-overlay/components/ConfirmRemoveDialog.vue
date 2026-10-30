<template>
  <AlertDialog status="danger" :title="`Remove ${member}?`" class="sm:max-w-[400px]">
    <template #body>
      <p>
        {{ member }} loses access to every board in this workspace. You can invite them again later.
      </p>
    </template>
    <template #footer>
      <Button variant="tertiary" @click="emit('close', false)">Keep</Button>
      <Button variant="danger" @click="emit('close', true)">Remove</Button>
    </template>
  </AlertDialog>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'

defineProps<{
  member: string
}>()

// The payload of `close` is what `await overlay.open()` resolves with.
const emit = defineEmits<{
  close: [confirmed: boolean]
}>()
</script>
