<template>
  <div class="flex flex-col items-start gap-3">
    <Drawer
      title="Upload queue"
      :dismissible="false"
      :keyboard-dismissible="false"
      @enter="log('enter')"
      @after:enter="log('after:enter')"
      @leave="log('leave')"
      @after:leave="log('after:leave')"
      @close:prevent="log('close:prevent')"
    >
      <Button variant="secondary"> Show Uploads </Button>
      <template #body>
        <p>Three files are still uploading. Keep this panel open until they finish.</p>
      </template>
      <template #footer="{ close }">
        <Button @click="close"> Done </Button>
      </template>
    </Drawer>
    <ol class="text-sm text-muted">
      <li v-for="(entry, index) in events" :key="index">{{ entry }}</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
import { ref } from 'vue'

const events = ref<string[]>([])

const log = (name: string) => {
  events.value = [...events.value.slice(-5), name]
}
</script>
