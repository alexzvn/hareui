<template>
  <Modal v-model:open="isOpen" title="Preview tools" placement="top" :ui="shell">
    <Button variant="secondary">Open preview tools</Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        placeholder="Search preview tools..."
        @update:model-value="isOpen = false"
      >
        <template #close>
          <Kbd>Esc</Kbd>
        </template>
      </CommandPalette>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Kbd, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(false)

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-89 w-full max-w-lg overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'build',
    items: [
      {
        label: 'Preview is live',
        description: 'preview/checkout-redesign · built 4 min ago',
        chip: { color: 'success' },
      },
    ],
  },
  {
    id: 'review',
    label: 'Review',
    items: [
      { label: 'Leave a comment', icon: icon('comment'), kbds: ['M'] },
      { label: 'Mentions', icon: icon('at'), kbds: ['A'] },
      { label: 'Toggle experiments...', icon: icon('flask'), kbds: ['X'] },
      { label: 'Copy share link', icon: icon('link'), kbds: ['L'] },
    ],
  },
  {
    id: 'debug',
    label: 'Debug',
    items: [
      { label: 'Network requests', icon: icon('globe'), kbds: ['N'] },
      { label: 'Console output', icon: icon('terminal'), kbds: ['O'] },
      { label: 'Clear cache and reload', icon: icon('arrows-rotate-right'), kbds: ['R'] },
    ],
  },
]
</script>
