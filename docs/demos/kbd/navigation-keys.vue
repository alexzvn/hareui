<script setup lang="ts">
import { Kbd } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted">Arrow Keys:</span>
      <div class="flex items-center gap-2">
        <Kbd keys="up" />
        <Kbd keys="down" />
        <Kbd keys="left" />
        <Kbd keys="right" />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted">Page Navigation:</span>
      <div class="flex items-center gap-2">
        <Kbd keys="pageup" />
        <Kbd keys="pagedown" />
        <Kbd keys="home" />
        <Kbd keys="end" />
      </div>
    </div>
  </div>
</template>
