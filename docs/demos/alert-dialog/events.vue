<template>
  <div class="flex flex-col items-start gap-3">
    <AlertDialog
      class="sm:max-w-[400px]"
      status="warning"
      title="Archive this board?"
      @enter="log('enter')"
      @after:enter="log('after:enter')"
      @leave="log('leave')"
      @after:leave="log('after:leave')"
      @close:prevent="log('close:prevent')"
    >
      <Button variant="secondary"> Archive Board </Button>
      <template #body>
        <p>The board and its 24 cards move to the archive. You can restore them later.</p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close"> Cancel </Button>
        <Button @click="close"> Archive </Button>
      </template>
    </AlertDialog>
    <ol class="text-sm text-muted">
      <li v-for="(entry, index) in events" :key="index">{{ entry }}</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'
import { ref } from 'vue'

const events = ref<string[]>([])

const log = (name: string) => {
  events.value = [...events.value.slice(-5), name]
}
</script>
