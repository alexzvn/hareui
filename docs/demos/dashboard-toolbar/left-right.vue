<script setup lang="ts">
import {
  Button,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardToolbar,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardPanel>
      <template #header>
        <DashboardNavbar title="Customers" :toggle="false" />

        <DashboardToolbar>
          <template #left>
            <Button variant="tertiary" size="sm">
              <Icon icon="gravity-ui:sliders" />
              Filter
            </Button>
          </template>

          <template #right>
            <Button variant="ghost" size="sm" class="max-sm:hidden"> Export </Button>
            <Button size="sm">
              <Icon icon="gravity-ui:plus" />
              New customer
            </Button>
          </template>
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
