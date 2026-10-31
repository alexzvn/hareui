<template>
  <ItemCard
    title="Travel fund"
    description="Savings · ends in 4410"
    class="w-full max-w-md"
    :ui="{ icon: 'size-10 rounded-full bg-accent-soft text-lg' }"
  >
    <template #icon>
      <span aria-hidden="true">🧳</span>
    </template>
    <template #action>
      <div class="flex items-center gap-2">
        <div class="text-end">
          <p class="text-sm font-semibold text-foreground">€2,480</p>
          <p class="text-xs text-muted">+€120</p>
        </div>
        <Button size="sm" variant="ghost" icon-only aria-label="Account options">
          <Icon icon="gravity-ui:ellipsis-vertical" />
        </Button>
      </div>
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { Button, ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
