<template>
  <CommandPalette
    :groups="groups"
    :autofocus="false"
    placeholder="Search settings..."
    class="h-80 w-full max-w-md rounded-2xl bg-surface shadow-surface"
  />
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        label: 'Language',
        icon: icon('globe'),
        placeholder: 'Pick a language...',
        children: [
          { label: 'English' },
          { label: 'Español' },
          { label: 'Français' },
          { label: 'Tiếng Việt' },
        ],
      },
      {
        label: 'Appearance',
        icon: icon('palette'),
        placeholder: 'Pick a theme...',
        children: [
          { label: 'Light', icon: icon('sun') },
          { label: 'Dark', icon: icon('moon') },
          { label: 'Match the system', icon: icon('display') },
        ],
      },
      { label: 'Keyboard shortcuts', icon: icon('keyboard'), kbds: ['command', '/'] },
    ],
  },
]
</script>
