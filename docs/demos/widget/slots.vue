<template>
  <Widget class="w-full max-w-[420px]">
    <template #title>
      <span class="flex items-center gap-2">
        <Icon icon="gravity-ui:thunderbolt" class="size-4 text-warning" />
        Power Draw
      </span>
    </template>
    <template #legend>
      <Chip size="sm" color="success">Live</Chip>
    </template>
    <p class="text-3xl font-semibold text-foreground tabular-nums">4.2 kW</p>
  </Widget>
</template>

<script setup lang="ts">
import { Chip, Widget } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
