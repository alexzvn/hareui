<script setup lang="ts">
import { DropZone } from '@hareui/vue'
</script>

<template>
  <DropZone
    class="w-full max-w-[420px]"
    label="Your storage is full"
    description="Delete old recordings to add new ones."
    trigger-label="Browse files"
    disabled
  />
</template>
