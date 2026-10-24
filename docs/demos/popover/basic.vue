<template>
  <div class="flex items-center gap-4">
    <Popover title="Popover Title" class="max-w-64">
      <Button>Click me</Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">
          This is the popover content. You can put any content here.
        </p>
      </template>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Button, Popover } from '@hareui/vue'
</script>
