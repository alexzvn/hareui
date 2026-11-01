<template>
  <Tabs class="w-full max-w-[400px]" :items="items" :ui="{ tabPanel: 'pt-4' }" />
</template>

<script setup lang="ts">
import type { TabsItem } from '@hareui/vue'
import { Tabs } from '@hareui/vue'

const items: TabsItem[] = [
  'Overview',
  'Analytics',
  'Reports',
  'Performance',
  'Engagement',
  'Audience',
  'Acquisition',
  'Retention',
  'Settings',
].map((label) => ({ label, value: label.toLowerCase(), content: `${label} panel content.` }))
</script>
