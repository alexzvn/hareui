<template>
  <Tabs class="w-full max-w-md" :items="items" default-value="inbox" :ui="{ tabPanel: 'pt-4' }" />
</template>

<script setup lang="ts">
import type { TabsItem } from '@hareui/vue'
import { Tabs } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: TabsItem[] = [
  {
    label: 'Inbox',
    value: 'inbox',
    icon: icon('envelope'),
    content: 'Messages waiting for a reply.',
  },
  {
    label: 'Drafts',
    value: 'drafts',
    icon: icon('pencil'),
    content: 'Messages you started writing.',
  },
  { label: 'Archive', value: 'archive', icon: icon('archive'), content: 'Messages you put away.' },
]
</script>
