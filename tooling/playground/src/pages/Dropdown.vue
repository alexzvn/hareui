<script setup lang="ts">
import type { DropdownEntry, DropdownValue } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { ref } from 'vue'

const lastAction = ref<DropdownValue>()
const selected = ref<DropdownValue[]>(['apple'])
const formatting = ref<DropdownValue[]>(['bold', 'left'])
const open = ref(false)

const actions: DropdownEntry[] = [
  { type: 'section', label: 'Actions', items: [
    { value: 'new-file', label: 'New file', description: 'Create a new file', kbd: { keys: 'command', content: 'N' } },
    { value: 'copy-link', label: 'Copy link', disabled: true },
    { value: 'share', label: 'Share', items: [
      { value: 'email', label: 'Email' },
      { value: 'message', label: 'Message' },
    ] },
  ] },
  { type: 'separator' },
  { value: 'delete-file', label: 'Delete file', variant: 'danger', kbd: { keys: ['command', 'shift'], content: 'D' } },
]

const fruits: DropdownEntry[] = ['Apple', 'Banana', 'Cherry'].map(label => ({ value: label.toLowerCase(), label }))

const sections: DropdownEntry[] = [
  { type: 'section', label: 'Style', items: [{ value: 'bold', label: 'Bold' }, { value: 'italic', label: 'Italic' }] },
  { type: 'section', label: 'Align', selectionMode: 'single', indicator: 'dot', items: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }] },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Dropdown</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Actions, sections, submenu</h2>
      <div class="flex items-center gap-2">
        <Dropdown :items="actions" @action="lastAction = $event">
          <Button variant="secondary">Actions</Button>
        </Dropdown>
        <span class="text-sm text-muted">last action: {{ lastAction ?? '-' }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Single selection</h2>
      <div class="flex items-center gap-2">
        <Dropdown v-model="selected" :items="fruits" selection-mode="single">
          <Button variant="secondary">Fruit</Button>
        </Dropdown>
        <span class="text-sm text-muted">{{ selected.join(', ') }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Section-level selection</h2>
      <div class="flex items-center gap-2">
        <Dropdown v-model="formatting" :items="sections" selection-mode="multiple">
          <Button variant="secondary">Format</Button>
        </Dropdown>
        <span class="text-sm text-muted">{{ formatting.join(', ') }}</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Controlled open, long press</h2>
      <div class="flex items-center gap-2">
        <Dropdown v-model:open="open" :items="fruits" trigger="longPress">
          <Button variant="secondary">Long press me</Button>
        </Dropdown>
        <span class="text-sm text-muted">{{ open ? 'open' : 'closed' }}</span>
      </div>
    </section>
  </div>
</template>
