<template>
  <CommandPalette
    :groups="groups"
    :autofocus="false"
    placeholder="Search the team..."
    class="h-72 w-full max-w-md rounded-2xl bg-surface shadow-surface"
  >
    <template #member-trailing="{ item }">
      <span class="flex items-center gap-1.5 text-xs text-muted">
        <span
          class="size-2 rounded-full"
          :class="item.online ? 'bg-success' : 'bg-default-foreground/30'"
        />
        {{ item.online ? 'Online' : 'Away' }}
      </span>
    </template>
    <template #member-group-label="{ label }">
      <span class="flex items-center gap-1.5">
        <Icon icon="gravity-ui:persons" class="size-3.5" />
        {{ label }}
      </span>
    </template>
  </CommandPalette>
</template>

<script setup lang="ts">
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup, CommandPaletteItem } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'

type Member = CommandPaletteItem & { online?: boolean }

const groups: CommandPaletteGroup<Member>[] = [
  {
    id: 'members',
    label: 'Support crew',
    slot: 'member',
    items: [
      { label: 'Priya Natarajan', description: 'Billing questions', online: true },
      { label: 'Lucas Ferreira', description: 'Integrations', online: false },
      { label: 'Hana Sato', description: 'Onboarding', online: true },
    ],
  },
  {
    id: 'links',
    label: 'Help center',
    items: [
      { label: 'Status page', href: 'https://example.com/status', target: '_blank' },
      { label: 'Contact form', href: 'https://example.com/contact', target: '_blank' },
    ],
  },
]
</script>
