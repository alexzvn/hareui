<script setup lang="ts">
import { Switch } from 'herouse'
</script>

<template>
  <Switch>
    <template #label="{ checked }">
      {{ checked ? 'Enabled' : 'Disabled' }}
    </template>
  </Switch>
</template>
