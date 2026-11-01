<template>
  <div class="flex w-96 flex-col gap-4">
    <div class="flex flex-col gap-2">
      <TextArea
        v-model.trim="note"
        aria-label="Release note"
        placeholder="Leading and trailing lines are dropped"
      />
      <span class="px-1 text-sm text-muted">.trim → {{ JSON.stringify(note) }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <TextArea
        v-model.lazy.nullable="summary"
        aria-label="Summary"
        placeholder="Updates on blur; empty is null"
      />
      <span class="px-1 text-sm text-muted">.lazy.nullable → {{ JSON.stringify(summary) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextArea } from '@hareui/vue'
import { ref } from 'vue'

const note = ref('')
const summary = ref<string | number | null>(null)
</script>
