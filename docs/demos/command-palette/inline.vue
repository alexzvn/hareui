<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <CommandPalette
      v-model="selected"
      :groups="groups"
      :autofocus="false"
      placeholder="Find a teammate..."
      class="h-72 rounded-2xl bg-surface shadow-surface"
    />
    <p class="text-sm text-muted">Selected: {{ selected?.label ?? 'nobody' }}</p>
  </div>
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup, CommandPaletteItem } from '@hareui/vue/command-palette'
import { ref } from 'vue'

const selected = ref<CommandPaletteItem>()

const avatar = (seed: number) => ({
  src: `https://img.heroui.chat/image/avatar?w=80&h=80&u=${seed}`,
  alt: '',
})

const groups: CommandPaletteGroup[] = [
  {
    id: 'people',
    label: 'Design team',
    items: [
      { label: 'Noor Haddad', suffix: 'Lead', avatar: avatar(12) },
      { label: 'Tomás Rivera', suffix: 'Illustrator', avatar: avatar(14) },
      { label: 'Ines Kowalski', suffix: 'Motion', avatar: avatar(21) },
      { label: 'Kenji Mori', suffix: 'Research', avatar: avatar(33) },
      { label: 'Ada Okafor', suffix: 'Product', avatar: avatar(45) },
    ],
  },
]
</script>
