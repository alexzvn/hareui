<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Kbd, ListBox, Surface } from 'herouse'

const items = [
  { type: 'section' as const, label: 'Actions', items: [
    { value: 'new-file', label: 'New file', description: 'Create a new file', icon: 'gravity-ui:square-plus', iconClass: 'text-muted', keys: ['command'], key: 'N' },
    { value: 'edit-file', label: 'Edit file', description: 'Make changes', icon: 'gravity-ui:pencil', iconClass: 'text-muted', keys: ['command'], key: 'E' },
  ] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Danger zone', items: [
    { value: 'delete-file', label: 'Delete file', description: 'Move to trash', variant: 'danger' as const, icon: 'gravity-ui:trash-bin', iconClass: 'text-danger', keys: ['command', 'shift'], key: 'D' },
  ] },
]
</script>

<template>
  <Surface class="w-[256px] rounded-3xl shadow-surface">
    <ListBox aria-label="File actions" class="w-full p-2" :items="items" selection-mode="none">
      <template #item-leading="{ item }">
        <div class="flex h-8 items-start justify-center pt-px">
          <Icon :class="['size-4 shrink-0', (item as any).iconClass]" :icon="(item as any).icon" />
        </div>
      </template>
      <template #item-trailing="{ item }">
        <Kbd class="ms-auto" :keys="(item as any).keys" variant="light">{{ (item as any).key }}</Kbd>
      </template>
    </ListBox>
  </Surface>
</template>
