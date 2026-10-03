<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { KbdKey, ListBoxEntry, ListBoxItem } from '@hareui/vue'
import { Kbd, ListBox, Surface } from '@hareui/vue'

interface FileAction extends ListBoxItem {
  icon: { name: string, cls: string }
  keys: KbdKey[]
  key: string
}

const icon = (name: string, cls = 'text-muted') => ({ name, cls })
const sections = (dangerDisabled: boolean): ListBoxEntry<FileAction>[] => [
  { type: 'section', label: 'Actions', items: [
    { value: 'new-file', label: 'New file', description: 'Create a new file', icon: icon('gravity-ui:square-plus'), keys: ['command'], key: 'N' },
    { value: 'edit-file', label: 'Edit file', description: 'Make changes', icon: icon('gravity-ui:pencil'), keys: ['command'], key: 'E' },
  ] },
  { type: 'separator' },
  { type: 'section', label: 'Danger zone', items: [
    { value: 'delete-file', label: 'Delete file', description: 'Move to trash', variant: 'danger', disabled: dangerDisabled, icon: icon('gravity-ui:trash-bin', 'text-danger'), keys: ['command', 'shift'], key: 'D' },
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
      :items="sections(false)"
      @action="value => alert(`Selected item: ${value}`)"
    >
      <template #item-leading="{ item }">
        <div class="flex h-8 items-start justify-center pt-px">
          <Icon :class="['size-4 shrink-0', item.icon.cls]" :icon="item.icon.name" />
        </div>
      </template>
      <template #item-trailing="{ item }">
        <Kbd class="ms-auto" variant="light" :keys="item.keys">
          {{ item.key }}
        </Kbd>
      </template>
    </ListBox>
  </Surface>
</template>
