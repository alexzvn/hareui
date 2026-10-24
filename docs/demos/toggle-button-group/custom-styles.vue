<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <ToggleButtonGroup
    aria-label="Text formatting"
    class="gap-1 rounded-xl border border-border/80 bg-surface p-1 shadow-sm"
    selection-mode="multiple"
  >
    <ToggleButton
      icon-only
      aria-label="Bold"
      class="rounded-lg text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
      value="bold"
    >
      <Icon icon="gravity-ui:bold" />
    </ToggleButton>
    <ToggleButton
      icon-only
      aria-label="Italic"
      class="rounded-lg text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
      value="italic"
    >
      <Icon icon="gravity-ui:italic" />
    </ToggleButton>
    <ToggleButton
      icon-only
      aria-label="Underline"
      class="rounded-lg text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
      value="underline"
    >
      <Icon icon="gravity-ui:underline" />
    </ToggleButton>
  </ToggleButtonGroup>
</template>
