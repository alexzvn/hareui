<template>
  <ItemCardGroup
    layout="grid"
    :columns="3"
    title="Integrations"
    description="Connected services"
    class="w-full max-w-2xl max-sm:grid-cols-1"
  >
    <ItemCard
      v-for="item in items"
      :key="item.title"
      :icon="icon(item.icon)"
      :title="item.title"
      :description="item.description"
    />
  </ItemCardGroup>
</template>

<script setup lang="ts">
import { ItemCard, ItemCardGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items = [
  { icon: 'calendar', title: 'Calendar', description: 'Two-way sync' },
  { icon: 'envelope', title: 'Mail', description: 'Inbox rules' },
  { icon: 'cloud-arrow-up-in', title: 'Storage', description: 'Nightly export' },
  { icon: 'persons', title: 'Directory', description: 'Team members' },
  { icon: 'credit-card', title: 'Payments', description: 'Payouts on Fridays' },
  { icon: 'gear', title: 'Webhooks', description: 'Three endpoints' },
]
</script>
