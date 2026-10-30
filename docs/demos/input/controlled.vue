<template>
  <div class="flex w-80 flex-col gap-2">
    <Input v-model="value" aria-label="Domain" placeholder="domain" />
    <span class="px-1 text-sm text-muted">https://{{ value || 'your-domain' }}</span>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('example.com')
</script>
