<template>
  <Tabs class="w-full max-w-md" :items="items" default-value="active" :ui="{ tabPanel: 'pt-4' }" />
</template>

<script setup lang="ts">
import type { TabsItem } from '@hareui/vue'
import { Tabs } from '@hareui/vue'

const items: TabsItem[] = [
  { label: 'Active', value: 'active', content: 'This tab is active and can be selected.' },
  {
    label: 'Disabled',
    value: 'disabled',
    disabled: true,
    content: 'This content cannot be accessed.',
  },
  { label: 'Available', value: 'available', content: 'This tab is also available for selection.' },
]
</script>
