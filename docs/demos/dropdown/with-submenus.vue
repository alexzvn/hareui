<script setup lang="ts">
import type { DropdownEntry } from 'herouse'
import { Button, Dropdown } from 'herouse'

const items: DropdownEntry[] = [
  { value: 'copy-link', label: 'Copy Link' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'X / Twitter' },
  {
    value: 'share',
    label: 'Other',
    items: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'telegram', label: 'Telegram' },
      { value: 'discord', label: 'Discord' },
      {
        value: 'email',
        label: 'Email',
        items: [
          { value: 'work', label: 'Work email' },
          { value: 'personal', label: 'Personal email' },
        ],
      },
    ],
  },
]
</script>

<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button aria-label="Menu" variant="secondary">
      Share
    </Button>
  </Dropdown>
</template>
