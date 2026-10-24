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

<template>
  <div class="w-[400px]">
    <Tabs :items="items" :ui="{ tabPanel: 'pt-4' }">
      <template #content="{ item }">
        <p>{{ item.content }}</p>
      </template>
    </Tabs>
  </div>
</template>
