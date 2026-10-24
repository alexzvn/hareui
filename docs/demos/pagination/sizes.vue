<template>
  <div class="flex flex-col gap-6">
    <div v-for="size in ['sm', 'md', 'lg'] as const" :key="size" class="flex flex-col gap-2">
      <span class="text-xs font-medium text-muted capitalize">{{ size }}</span>
      <Pagination
        class="justify-center"
        :aria-label="`Pagination, ${size}`"
        :size="size"
        :total="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from '@hareui/vue'
</script>
