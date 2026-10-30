<template>
  <Popover align="start">
    <Button variant="secondary" class="gap-2">
      <Icon icon="gravity-ui:tag" />
      {{ selected.length ? `Tags (${selected.length})` : 'Add tags' }}
    </Button>
    <template #content>
      <CommandPalette
        v-model="selected"
        multiple
        value-key="label"
        :groups="groups"
        placeholder="Filter tags..."
        class="max-h-64 w-64"
      />
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { Button, Popover } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const selected = ref<string[]>(['Urgent'])

const tag = (label: string, color: 'accent' | 'success' | 'warning' | 'danger') => ({
  label,
  chip: { color },
})

const groups: CommandPaletteGroup[] = [
  {
    id: 'tags',
    items: [
      tag('Urgent', 'danger'),
      tag('Waiting on client', 'warning'),
      tag('Ready to ship', 'success'),
      tag('Needs design', 'accent'),
      tag('Backlog', 'accent'),
    ],
  },
]
</script>
