<template>
  <Drawer placement="right" :title="`${project} activity`">
    <template #body>
      <ol class="flex flex-col gap-4">
        <li v-for="event in events" :key="event.id" class="flex flex-col gap-0.5 text-sm">
          <span class="font-medium">{{ event.summary }}</span>
          <span class="text-muted">{{ event.time }}</span>
        </li>
      </ol>
    </template>
    <template #footer>
      <Button variant="secondary" @click="emit('close')">Close</Button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'

defineProps<{
  project: string
  events: { id: number; summary: string; time: string }[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
