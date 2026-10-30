<template>
  <div class="flex flex-wrap gap-3">
    <Modal
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
      title="Command palette"
      placement="top"
      :ui="shell"
    >
      <Button variant="secondary" class="capitalize">{{ variant }}</Button>
      <template #content="{ close }">
        <CommandPalette :groups="groups" @update:model-value="close" />
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

const variants = ['opaque', 'blur', 'transparent'] as const

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-89 w-full max-w-lg overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'playback',
    label: 'Playback',
    items: [
      { label: 'Play next episode', icon: icon('play') },
      { label: 'Skip intro', icon: icon('forward-step') },
      { label: 'Subtitles', icon: icon('text') },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    items: [
      { label: 'Continue watching', icon: icon('clock') },
      { label: 'Saved for later', icon: icon('bookmark') },
    ],
  },
]
</script>
