<template>
  <div class="flex min-h-screen items-center justify-center p-6">
    <p class="text-center text-sm text-muted">Below 640px the buttons show only their icons.</p>
    <ActionBar default-open aria-label="Message actions">
      <template #prefix>
        <Chip size="sm" variant="secondary" class="shrink-0 tabular-nums">12</Chip>
      </template>
      <template #default="{ labelClass }">
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:archive" />
          <span :class="labelClass">Archive</span>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:copy" />
          <span :class="labelClass">Duplicate</span>
        </Button>
        <Button size="sm" variant="danger-soft">
          <Icon icon="gravity-ui:trash-bin" />
          <span :class="labelClass">Delete</span>
        </Button>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { ActionBar, Button, Chip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
