<template>
  <ContextMenu :items="items">
    <div
      class="flex h-48 w-80 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none"
    >
      Right-click the document
    </div>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ContextMenuEntry[] = [
  { value: 'open', label: 'Open', icon: icon('folder-open') },
  { value: 'rename', label: 'Rename', icon: icon('pencil'), kbd: { keys: 'enter' } },
  { value: 'link', label: 'Copy link', icon: icon('link') },
  { type: 'separator' },
  {
    value: 'delete',
    label: 'Move to trash',
    icon: icon('trash-bin'),
    variant: 'danger',
    kbd: { keys: ['command', 'delete'] },
  },
]
</script>
