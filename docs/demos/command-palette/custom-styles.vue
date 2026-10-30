<template>
  <Modal v-model:open="isOpen" title="Task actions" placement="top" :ui="shell">
    <Button variant="secondary">Open task actions</Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        :icon="false"
        placeholder="Type an action..."
        size="lg"
        :ui="ui"
        @update:model-value="isOpen = false"
      >
        <template #header>
          <Chip size="sm" variant="soft" class="ms-2 mt-2">Task · DOC-207</Chip>
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

// A larger input, square rows with an accent bar on the highlighted one, and plain-text shortcuts.
const ui = {
  inputField: 'h-14 text-lg',
  item: 'rounded-none data-highlighted:bg-default/60 data-highlighted:shadow-[inset_2px_0_0_var(--accent)]',
  itemTrailingKbd: 'bg-transparent font-mono text-muted',
}

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'task',
    items: [
      { label: 'Hand off to...', icon: icon('person-pencil'), kbds: ['H'] },
      { label: 'Take it myself', icon: icon('person'), kbds: ['M'] },
      { label: 'Move to column...', icon: icon('layout-columns'), kbds: ['C'] },
      { label: 'Set effort...', icon: icon('chart-column'), kbds: ['E'] },
      { label: 'Add tags...', icon: icon('tag'), kbds: ['T'] },
      { label: 'Clear tags', icon: icon('trash-bin'), kbds: ['shift', 'T'] },
      { label: 'Pick a deadline...', icon: icon('calendar'), kbds: ['shift', 'D'] },
    ],
  },
]
</script>
