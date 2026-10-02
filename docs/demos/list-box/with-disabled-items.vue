<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Kbd, ListBox, Surface } from 'herouse'
const icon = (name: string, cls = 'text-muted') => ({ name, cls })
const sections = (dangerDisabled: boolean) => [
  { type: 'section' as const, label: 'Actions', items: [
    { value: 'new-file', label: 'New file', description: 'Create a new file', icon: icon('gravity-ui:square-plus'), keys: ['command'], key: 'N' },
    { value: 'edit-file', label: 'Edit file', description: 'Make changes', icon: icon('gravity-ui:pencil'), keys: ['command'], key: 'E' },
  ] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Danger zone', items: [
    { value: 'delete-file', label: 'Delete file', description: 'Move to trash', variant: 'danger' as const, disabled: dangerDisabled, icon: icon('gravity-ui:trash-bin', 'text-danger'), keys: ['command', 'shift'], key: 'D' },
  ] },
]
const alert = (message: string) => window.alert(message)
</script>

<template>
  <Surface class="w-[256px] rounded-3xl shadow-surface">
    <ListBox
      aria-label="File actions"
      class="w-full p-2"
      selection-mode="none"
      :items="sections(true)"
      @action="value => alert(`Selected item: ${value}`)"
    >
      <template #item-leading="{ item }">
        <div class="flex h-8 items-start justify-center pt-px">
          <Icon :class="['size-4 shrink-0', (item as any).icon.cls]" :icon="(item as any).icon.name" />
        </div>
      </template>
      <template #item-trailing="{ item }">
        <Kbd class="ms-auto" variant="light" :keys="(item as any).keys">
          {{ (item as any).key }}
        </Kbd>
      </template>
    </ListBox>
  </Surface>
</template>
