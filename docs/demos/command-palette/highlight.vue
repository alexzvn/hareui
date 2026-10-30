<template>
  <CommandPalette
    :groups="groups"
    :fuse="{ fuseOptions: { includeMatches: true } }"
    :autofocus="false"
    v-model:search-term="searchTerm"
    placeholder="Search the docs..."
    class="h-72 w-full max-w-md rounded-2xl bg-surface shadow-surface"
  />
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { ref } from 'vue'

const searchTerm = ref('note')

const groups: CommandPaletteGroup[] = [
  {
    id: 'guides',
    label: 'Guides',
    items: [
      { label: 'Taking notes', description: 'Capture ideas from any screen' },
      { label: 'Sharing a notebook', description: 'Invite people to read or edit' },
      {
        label: 'Offline mode',
        description: 'Keep working without a connection, then sync your notes',
      },
      { label: 'Exporting', description: 'Download pages as Markdown or PDF' },
    ],
  },
]
</script>
