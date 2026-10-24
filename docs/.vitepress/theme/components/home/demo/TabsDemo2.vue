<script setup lang="ts">
import { Tabs } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items = [
  { label: 'Chats', value: 'chats', icon: 'gravity-ui:comment' },
  { label: 'Emails', value: 'emails', icon: 'gravity-ui:envelope' },
]
</script>

<template>
  <Tabs
    class="w-[256px]"
    aria-label="Options"
    :items="items"
    :content="false"
    :ui="{ tab: 'gap-1.5' }"
  >
    <template #tab="{ item }">
      <Icon :icon="items.find((i) => i.value === item.value)!.icon" />
      <span>{{ item.label }}</span>
    </template>
  </Tabs>
</template>
