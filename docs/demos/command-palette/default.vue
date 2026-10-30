<template>
  <Modal v-model:open="isOpen" title="Command palette" placement="top" :ui="shell">
    <Button variant="secondary" class="gap-2">
      Search commands
      <Kbd keys="command">J</Kbd>
    </Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        placeholder="Search or run a command..."
        @update:model-value="isOpen = false"
      >
        <template #header>
          <Chip size="sm" variant="soft">Studio</Chip>
        </template>
        <template #close>
          <Kbd>Esc</Kbd>
        </template>
        <template #footer>
          <Kbd keys="up" />
          <Kbd keys="down" />
          <span>Move</span>
          <Kbd keys="enter" class="ms-2" />
          <span>Run</span>
        </template>
      </CommandPalette>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Chip, Kbd, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'

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
    id: 'create',
    label: 'Create',
    items: [
      { label: 'New sketch', icon: icon('pencil') },
      { label: 'New moodboard', icon: icon('layout-cells') },
      { label: 'Share with a client', icon: icon('person-plus') },
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    items: [
      { label: 'Brushes and palettes', icon: icon('palette') },
      { label: 'Export settings', icon: icon('gear') },
    ],
  },
]

// Opens the palette with Cmd/Ctrl + J.
const onKeydown = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() !== 'j' || !(event.metaKey || event.ctrlKey)) return

  event.preventDefault()
  isOpen.value = !isOpen.value
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
