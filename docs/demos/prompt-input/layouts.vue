<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <div v-for="layout in layouts" :key="layout" class="flex flex-col gap-2">
      <span class="text-sm font-medium text-muted capitalize">{{ layout }}</span>
      <PromptInput
        v-model="drafts[layout]"
        v-model:files="files[layout]"
        :layout
        placeholder="Ask anything"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PromptInput } from '@hareui/vue'
import { reactive } from 'vue'

const layouts = ['stacked', 'compact', 'inline'] as const

const drafts = reactive({ stacked: '', compact: '', inline: '' })

const files = reactive<Record<(typeof layouts)[number], File[]>>({
  stacked: [],
  compact: [],
  inline: [],
})
</script>
