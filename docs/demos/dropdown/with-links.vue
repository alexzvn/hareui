<template>
  <div class="flex flex-col items-center gap-3">
    <Dropdown :items="items">
      <Button variant="secondary"> Help </Button>
    </Dropdown>
    <p class="text-sm text-muted">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Button, Dropdown } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const message = ref('Pick an entry')

const items: DropdownEntry[] = [
  {
    value: 'guide',
    label: 'Getting started',
    icon: icon('book-open'),
    href: '/docs/getting-started',
  },
  {
    value: 'changelog',
    label: 'Release notes',
    icon: icon('file-text'),
    href: 'https://github.com/alexzvn/hareui/releases',
    target: '_blank',
  },
  {
    value: 'archive',
    label: 'Old manual',
    icon: icon('archive'),
    href: '#',
    disabled: true,
  },
  { type: 'separator' },
  {
    value: 'feedback',
    label: 'Send feedback',
    icon: icon('comment'),
    onSelect: () => {
      message.value = 'Thanks for the feedback'
    },
  },
]
</script>
