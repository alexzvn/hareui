<template>
  <div class="flex flex-wrap gap-3">
    <Modal
      v-for="option in options"
      :key="option.size"
      title="Command palette"
      placement="top"
      :ui="{ container: shellContainer, dialog: option.shell }"
    >
      <Button variant="secondary">{{ option.label }}</Button>
      <template #content="{ close }">
        <CommandPalette :size="option.size" :groups="groups" @update:model-value="close" />
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// The palette size caps its width; the dialog sets the matching width and the height cap.
// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shellContainer =
  'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!'

const options = [
  {
    size: 'sm',
    label: 'Small',
    shell: 'max-h-75 w-full max-w-sm overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
  },
  {
    size: 'md',
    label: 'Medium',
    shell: 'max-h-89 w-full max-w-lg overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
  },
  {
    size: 'lg',
    label: 'Large',
    shell: 'max-h-110 w-full max-w-xl overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
  },
] as const

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'garden',
    label: 'Garden',
    items: [
      { label: 'Log watering', icon: icon('droplet') },
      { label: 'Add a plant', icon: icon('plus') },
      { label: 'Frost alerts', icon: icon('snowflake') },
    ],
  },
  {
    id: 'season',
    label: 'Season',
    items: [
      { label: 'Sowing calendar', icon: icon('calendar') },
      { label: 'Harvest notes', icon: icon('file-text') },
    ],
  },
]
</script>
