<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: DropdownEntry[] = [
  { value: 'copy-link', label: 'Copy Link' },
  { value: 'facebook', label: 'Facebook' },
  {
    value: 'share',
    label: 'More options',
    items: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'telegram', label: 'Telegram' },
      {
        value: 'email',
        label: 'Email',
        items: [
          { value: 'work', label: 'Work email' },
          { value: 'personal', label: 'Personal email' },
        ],
      },
      { value: 'discord', label: 'Discord' },
    ],
  },
  {
    value: 'other',
    label: 'Other (default indicator)',
    items: [{ value: 'sms', label: 'SMS' }],
  },
]
</script>

<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary">
      Share
    </Button>
    <!-- Items the slot renders nothing for keep the default chevron -->
    <template #submenu-indicator="{ item }">
      <Icon v-if="item.value === 'share'" class="size-3.5 text-muted" icon="gravity-ui:arrow-right" />
      <svg
        v-else-if="item.value === 'email'"
        class="size-3.5 text-muted"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </template>
  </Dropdown>
</template>
