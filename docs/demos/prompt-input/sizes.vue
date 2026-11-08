<template>
  <div class="flex w-full max-w-xl flex-col gap-6">
    <PromptInput v-model="drafts.sm" size="sm" placeholder="Small" />
    <PromptInput v-model="drafts.md" placeholder="Medium" />
    <PromptInput v-model="drafts.lg" size="lg" placeholder="Large" />
  </div>
</template>

<script setup lang="ts">
import { PromptInput } from '@hareui/vue'
import { reactive } from 'vue'

const drafts = reactive({ sm: '', md: '', lg: '' })
</script>
