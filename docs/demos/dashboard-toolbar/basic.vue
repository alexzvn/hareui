<script setup lang="ts">
import {
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardToolbar,
  Link,
  Tabs,
} from '@hareui/vue'

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Members', value: 'members' },
  { label: 'Billing', value: 'billing' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardPanel>
      <template #header>
        <DashboardNavbar title="Settings" :toggle="false" />

        <DashboardToolbar>
          <Tabs :items="tabs" default-value="general" :content="false" class="w-fit min-w-0" />

          <Link
            href="https://github.com/alexzvn/hareui/issues"
            class="shrink-0 text-sm max-sm:hidden"
            icon
          >
            Help &amp; Feedback
          </Link>
        </DashboardToolbar>
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>
