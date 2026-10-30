<template>
  <SwitchGroup>
    <Switch name="notifications" label="Allow Notifications" />
    <Switch name="marketing" label="Marketing emails" />
    <Switch name="social" label="Social media updates" />
  </SwitchGroup>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup } from '@hareui/vue'
</script>
