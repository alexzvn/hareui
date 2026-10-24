<template>
  <Dropdown :items="items" @action="(key) => console.log(`Selected: ${key}`)">
    <Button variant="secondary"> Share </Button>
  </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'

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
