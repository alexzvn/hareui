<script setup lang="ts">
import { Kbd } from '@hareui/vue'

const rows = [
  { label: 'Copy:', keys: ['command'], key: 'C' },
  { label: 'Paste:', keys: ['command'], key: 'V' },
  { label: 'Cut:', keys: ['command'], key: 'X' },
  { label: 'Undo:', keys: ['command'], key: 'Z' },
  { label: 'Redo:', keys: ['command', 'shift'], key: 'Z' },
] as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="row in rows" :key="row.label" class="flex items-center gap-2">
      <span>{{ row.label }}</span>
      <Kbd :keys="[...row.keys]">
        {{ row.key }}
      </Kbd>
      <Kbd variant="light" :keys="[...row.keys]">
        {{ row.key }}
      </Kbd>
    </div>
  </div>
</template>
