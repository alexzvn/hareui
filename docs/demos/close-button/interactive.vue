<script setup lang="ts">
import { ref } from 'vue'
import { CloseButton } from 'herouse'

const count = ref(0)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <CloseButton :aria-label="`Close (clicked ${count} times)`" @click="count++" />
    <span class="text-sm text-muted">Clicked: {{ count }} times</span>
  </div>
</template>
