<template>
  <ListView :items="[]" aria-label="Downloads" class="max-w-md">
    <template #empty>
      <EmptyState
        :icon="h(Icon, { icon: 'gravity-ui:arrow-down-to-line' })"
        title="No downloads yet"
        description="Files you download appear here."
        size="sm"
      />
    </template>
  </ListView>
</template>

<script setup lang="ts">
import { EmptyState, ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'
</script>
