<script setup lang="ts">
import { Tabs } from '@hareui/vue'

const items = [
  { label: 'Account', value: 'account', heading: 'Account Settings', content: 'Manage your account information and preferences.' },
  { label: 'Security', value: 'security', heading: 'Security Settings', content: 'Configure two-factor authentication and password settings.' },
  { label: 'Notifications', value: 'notifications', heading: 'Notification Preferences', content: 'Choose how and when you want to receive notifications.' },
  { label: 'Billing', value: 'billing', heading: 'Billing Information', content: 'View and manage your subscription and payment methods.' },
]
</script>

<template>
  <Tabs class="w-full max-w-lg" :items="items" default-value="account" orientation="vertical" variant="secondary" :ui="{ tabPanel: 'px-4' }">
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
