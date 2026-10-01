<script setup lang="ts">
import { Tabs } from 'herouse'

const items = [
  { label: 'Overview', value: 'overview', content: 'View your project overview and recent activity.' },
  { label: 'Analytics', value: 'analytics', content: 'Track your metrics and analyze performance data.' },
  { label: 'Reports', value: 'reports', content: 'Generate and download detailed reports.' },
]
</script>

<template>
  <Tabs class="w-full max-w-md" :items="items" default-value="overview" variant="secondary" :ui="{ tabPanel: 'pt-4' }" />
</template>
