<template>
  <Modal v-model:open="isOpen" title="Command palette" placement="top" :ui="shell">
    <Button variant="secondary">Open planner commands</Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        :icon="false"
        size="lg"
        placeholder="What should we plan?"
        @update:model-value="isOpen = false"
      >
        <template #header>
          <Chip size="sm" variant="soft" class="ms-2">Planner</Chip>
        </template>
      </CommandPalette>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Chip, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(false)

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-110 w-full max-w-xl overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'trips',
    label: 'Trips',
    items: [
      { label: 'Find a trip...', icon: icon('magnifier'), kbds: ['T', 'F'] },
      { label: 'Plan a new trip...', icon: icon('plus') },
    ],
  },
  {
    id: 'crew',
    label: 'Travel crew',
    items: [
      { label: 'Find a traveller...', icon: icon('persons'), kbds: ['shift', 'P'] },
      { label: 'Add a traveller...', icon: icon('plus') },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    items: [
      { label: 'Read the guides...', icon: icon('book-open'), kbds: ['shift', 'G'] },
      { label: 'Share an idea...', icon: icon('bulb') },
      { label: 'Write to us', icon: icon('envelope') },
    ],
  },
]
</script>
