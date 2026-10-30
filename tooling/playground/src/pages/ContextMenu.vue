<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuItem, ContextMenuValue } from '@/components/context-menu'
import { ContextMenu } from '@/components/context-menu'
import { Button } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

type IconItem = ContextMenuItem & { icon?: string }

const lastAction = ref<ContextMenuValue>()
const sort = ref<ContextMenuValue[]>(['name'])
const layers = ref<ContextMenuValue[]>(['grid', 'snap', 'medium'])
const open = ref(false)

const canvas: ContextMenuEntry<IconItem>[] = [
  { value: 'undo', label: 'Undo', icon: 'gravity-ui:arrow-uturn-ccw-left', kbd: { keys: 'command', content: 'Z' } },
  { value: 'redo', label: 'Redo', icon: 'gravity-ui:arrow-uturn-cw-right', disabled: true, kbd: { keys: ['command', 'shift'], content: 'Z' } },
  { type: 'separator' },
  { value: 'duplicate', label: 'Duplicate', icon: 'gravity-ui:copy', description: 'Places a copy next to it' },
  { value: 'remove', label: 'Remove', icon: 'gravity-ui:trash-bin', variant: 'danger', kbd: { keys: 'delete' } },
]

const groups: ContextMenuEntry[][] = [
  [{ value: 'open', label: 'Open' }, { value: 'open-tab', label: 'Open in new tab' }],
  [{ value: 'rename', label: 'Rename' }, { value: 'move', label: 'Move to…' }],
  [{ value: 'archive', label: 'Archive', variant: 'danger' }],
]

const sortItems: ContextMenuEntry[] = [
  { type: 'section', label: 'Sort by', items: [
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'modified', label: 'Date modified' },
  ] },
]

const viewItems: ContextMenuEntry[] = [
  { value: 'zoom-in', label: 'Zoom in', kbd: { keys: 'command', content: '+' } },
  { value: 'arrange', label: 'Arrange', items: [
    { value: 'front', label: 'Bring to front' },
    { value: 'back', label: 'Send to back' },
    { value: 'align', label: 'Align', items: [
      { value: 'align-left', label: 'Left edges' },
      { value: 'align-center', label: 'Centers' },
    ] },
  ] },
  { type: 'separator' },
  { type: 'section', selectionMode: 'multiple', items: [
    { value: 'grid', label: 'Show grid' },
    { value: 'snap', label: 'Snap to grid' },
  ] },
  { type: 'separator' },
  { type: 'section', label: 'Grid size', selectionMode: 'single', indicator: 'dot', items: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ] },
]

const simple: ContextMenuEntry[] = [
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' },
  { value: 'select-all', label: 'Select all' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">ContextMenu</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Actions, icons, shortcuts, description, disabled and danger items</h2>
      <div class="flex items-center gap-4">
        <ContextMenu :items="canvas" @action="lastAction = $event">
          <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Right-click the canvas</div>
          <template #item-leading="{ item }">
            <Icon v-if="item.icon" class="size-4 shrink-0" :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'" :icon="item.icon" />
          </template>
        </ContextMenu>
        <span class="text-sm text-muted">last action: {{ lastAction ?? '-' }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Groups (array of arrays)</h2>
      <ContextMenu :items="groups" @action="lastAction = $event">
        <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Right-click a file</div>
      </ContextMenu>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Single selection</h2>
      <div class="flex items-center gap-4">
        <ContextMenu v-model="sort" :items="sortItems" selection-mode="single">
          <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Right-click to sort</div>
        </ContextMenu>
        <span class="text-sm text-muted">{{ sort.join(', ') || '-' }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Submenus, section-level multiple and single (dot) selection</h2>
      <div class="flex items-center gap-4">
        <ContextMenu v-model="layers" :items="viewItems" @action="lastAction = $event">
          <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Right-click the board</div>
        </ContextMenu>
        <span class="text-sm text-muted">{{ layers.join(', ') }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Controlled, disabled, non-modal</h2>
      <div class="flex flex-wrap items-start gap-4">
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted">open: {{ open }}</span>
            <Button size="sm" variant="secondary" @click="open = true">Open</Button>
          </div>
          <ContextMenu v-model:open="open" :items="simple">
            <div class="flex h-32 w-56 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Controlled</div>
          </ContextMenu>
        </div>
        <ContextMenu :items="simple" disabled>
          <div class="flex h-32 w-56 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Disabled</div>
        </ContextMenu>
        <ContextMenu :items="simple" :modal="false">
          <div class="flex h-32 w-56 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Non-modal</div>
        </ContextMenu>
        <ContextMenu :items="simple" tabindex="0" class="rounded-xl">
          <div class="flex h-32 w-56 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Focusable (Shift+F10)</div>
        </ContextMenu>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots: content-top, content-bottom, item-label, item-trailing</h2>
      <ContextMenu :items="simple">
        <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Right-click for slots</div>
        <template #content-top>
          <p class="px-4 pt-3 text-xs text-muted">3 items selected</p>
        </template>
        <template #item-label="{ item }">
          <span class="uppercase">{{ item.label }}</span>
        </template>
        <template #item-trailing="{ item }">
          <span class="ms-auto text-xs text-muted">{{ String(item.value).length }}</span>
        </template>
        <template #content-bottom>
          <p class="px-4 pb-3 text-xs text-muted">Edited 2 min ago</p>
        </template>
      </ContextMenu>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <ContextMenu :items="simple" :ui="{ popover: 'min-w-72 rounded-xl', item: 'rounded-lg', trigger: 'rounded-xl ring-2 ring-accent' }">
        <div class="flex h-40 w-72 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted select-none">Custom styles</div>
      </ContextMenu>
    </section>
  </div>
</template>
