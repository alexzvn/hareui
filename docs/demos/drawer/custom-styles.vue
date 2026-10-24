<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
</script>

<template>
  <Drawer
    class="border-l border-border/80 bg-surface"
    :close-button="false"
    placement="right"
    title="Filters"
    :ui="{ heading: 'text-foreground' }"
    variant="blur"
  >
    <Button variant="secondary"> Open filters </Button>
    <template #body>
      <p class="text-sm text-muted">Narrow results by status, owner, or date.</p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Cancel </Button>
      <Button @click="close"> Apply </Button>
    </template>
  </Drawer>
</template>
