<script setup lang="ts">
import { Switch, SwitchGroup } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">SwitchGroup</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Vertical (default)</h2>
      <SwitchGroup>
        <Switch name="notifications" label="Allow Notifications" />
        <Switch name="marketing" label="Marketing emails" />
        <Switch name="social" label="Social media updates" />
      </SwitchGroup>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Horizontal</h2>
      <SwitchGroup class="overflow-x-auto" orientation="horizontal">
        <Switch name="notifications" label="Notifications" />
        <Switch name="marketing" label="Marketing" />
        <Switch name="social" label="Social" />
      </SwitchGroup>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">:ui override</h2>
      <SwitchGroup :ui="{ items: 'gap-8' }">
        <Switch name="a" label="Option A" />
        <Switch name="b" label="Option B" />
      </SwitchGroup>
    </section>
  </div>
</template>
