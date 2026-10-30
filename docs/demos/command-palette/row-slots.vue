<template>
  <Modal v-model:open="isOpen" title="Launcher" placement="top" :ui="shell">
    <Button variant="secondary">Open launcher</Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        :icon="false"
        size="lg"
        placeholder="Search apps and actions..."
        @update:model-value="isOpen = false"
      >
        <template #item-leading="{ item }">
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-md text-white"
            :class="item.tint"
          >
            <Icon class="size-3" :icon="`gravity-ui:${item.glyph}`" />
          </span>
        </template>
        <template #item-trailing="{ item }">
          <span class="text-muted">{{ item.kind }}</span>
        </template>
        <template #footer>
          <span>Open</span>
          <Kbd keys="enter" />
          <span class="ms-auto border-s border-border ps-2">More actions</span>
          <Kbd keys="command">K</Kbd>
        </template>
      </CommandPalette>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Kbd, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup, CommandPaletteItem } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isOpen = ref(false)

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-110 w-full max-w-xl overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

type Entry = CommandPaletteItem & { glyph: string; tint: string; kind: 'App' | 'Action' }

const groups: CommandPaletteGroup<Entry>[] = [
  {
    id: 'recent',
    label: 'Recently used',
    items: [
      { label: 'Sketchbook', glyph: 'pencil', tint: 'bg-pink-500', kind: 'App' },
      { label: 'Roadmap', glyph: 'chart-line', tint: 'bg-indigo-500', kind: 'App' },
      { label: 'Mailroom', glyph: 'envelope', tint: 'bg-sky-500', kind: 'App' },
      { label: 'Recorder', glyph: 'microphone', tint: 'bg-rose-500', kind: 'App' },
      { label: 'Ledger', glyph: 'book-open', tint: 'bg-amber-500', kind: 'App' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { label: 'Screenshot history', glyph: 'picture', tint: 'bg-red-500', kind: 'Action' },
      {
        label: 'Install a plugin',
        glyph: 'plug-connection',
        tint: 'bg-emerald-500',
        kind: 'Action',
      },
      { label: 'Manage plugins', glyph: 'puzzle', tint: 'bg-teal-500', kind: 'Action' },
      { label: 'Window layouts', glyph: 'layout-columns', tint: 'bg-violet-500', kind: 'Action' },
    ],
  },
]
</script>
