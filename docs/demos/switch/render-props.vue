<template>
  <Switch>
    <template #label="{ checked }">
      {{ checked ? 'Enabled' : 'Disabled' }}
    </template>
  </Switch>
</template>

<script setup lang="ts">
import { Switch } from '@hareui/vue'
</script>
