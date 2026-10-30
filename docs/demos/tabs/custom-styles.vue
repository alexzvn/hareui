<template>
  <Tabs
    class="w-full max-w-sm"
    :items="items"
    default-value="monthly"
    :ui="{
      tabListContainer: 'rounded-none bg-transparent',
      tabList: 'rounded-xl border border-accent/10 bg-accent-soft/30 p-1',
      tab: tabClass,
      tabIndicator: 'rounded-lg bg-accent shadow-none',
      tabPanel: 'pt-3 text-sm text-muted',
    }"
  />
</template>

<script setup lang="ts">
import type { TabsItem } from '@hareui/vue'
import { Tabs } from '@hareui/vue'

const items: TabsItem[] = [
  { label: 'Monthly', value: 'monthly', content: 'Billed monthly, cancel anytime.' },
  { label: 'Yearly', value: 'yearly', content: 'Save 20% with annual billing.' },
]

// Hover and press styles use `hover:` / `active:`; the theme's own hover dimming is a
// higher-specificity rule, so `opacity-100!` turns the dimming off.
const tabClass = [
  'rounded-lg bg-transparent text-muted opacity-100! transition-colors shadow-none',
  'hover:not-data-[state=active]:bg-accent-soft',
  'hover:not-data-[state=active]:text-accent-soft-foreground',
  'active:not-data-[state=active]:bg-accent-soft-hover',
  'focus-visible:ring-2 focus-visible:ring-accent/15',
  'data-[state=active]:font-medium data-[state=active]:text-accent-foreground',
].join(' ')
</script>
