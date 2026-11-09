<template>
  <div class="flex items-center gap-3">
    <Button @click="saves++">Save draft</Button>
    <Popover :modal="false" arrow title="Autosave" class="max-w-64">
      <Button icon-only size="sm" variant="ghost" aria-label="About autosave">
        <Icon icon="gravity-ui:circle-info" />
      </Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">Drafts also save every 30 seconds while you type.</p>
      </template>
    </Popover>
    <span class="text-sm text-muted">Saves: {{ saves }}</span>
  </div>
</template>

<script setup lang="ts">
import { Button, Popover } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const saves = ref(0)
</script>
