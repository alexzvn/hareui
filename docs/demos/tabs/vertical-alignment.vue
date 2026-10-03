<script setup lang="ts">
import { Tabs } from '@hareui/vue'

const items = [
  { label: 'General', value: 'general', heading: 'General', content: 'Manage your account information and preferences.' },
  { label: 'Subscription & Billing', value: 'billing', heading: 'Subscription & Billing', content: 'View and manage your plan and payment methods.' },
  { label: 'Appearance', value: 'appearance', heading: 'Appearance', content: 'Choose a theme and adjust the interface density.' },
  { label: 'Notifications', value: 'notifications', heading: 'Notifications', content: 'Choose how and when you want to receive notifications.' },
  { label: 'Privacy', value: 'privacy', heading: 'Privacy', content: 'Control what you share and who can see your activity.' },
]
</script>

<template>
  <Tabs class="w-full max-w-lg" :items="items" align="start" default-value="general" orientation="vertical" variant="secondary" :ui="{ tabPanel: 'px-4' }">
    <template #content="{ item }">
      <h3 class="mb-2 font-semibold">
        {{ item.heading }}
      </h3>
      <p class="text-sm text-muted">
        {{ item.content }}
      </p>
    </template>
  </Tabs>
</template>
