<template>
  <SwitchGroup orientation="horizontal" :ui="{ items: 'flex-wrap' }">
    <Switch name="notifications" label="Notifications" />
    <Switch name="marketing" label="Marketing" />
    <Switch name="social" label="Social" />
  </SwitchGroup>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup } from '@hareui/vue'
</script>
