<template>
  <div class="flex flex-col items-start gap-3">
    <Modal
      title="Release notes"
      :dismissible="false"
      @enter="log('enter')"
      @after:enter="log('after:enter')"
      @leave="log('leave')"
      @after:leave="log('after:leave')"
      @close:prevent="log('close:prevent')"
    >
      <Button variant="secondary"> What's New </Button>
      <template #body>
        <p>Version 2.4 adds offline mode, faster search and a dark theme.</p>
      </template>
      <template #footer="{ close }">
        <Button @click="close"> Got It </Button>
      </template>
    </Modal>
    <ol class="text-sm text-muted">
      <li v-for="(entry, index) in events" :key="index">{{ entry }}</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { ref } from 'vue'

const events = ref<string[]>([])

const log = (name: string) => {
  events.value = [...events.value.slice(-5), name]
}
</script>
