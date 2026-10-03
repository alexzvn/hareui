<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton } from '@hareui/vue'
</script>

<template>
  <ToggleButton class="gap-2 rounded-full border border-border/80 bg-surface px-4 text-foreground shadow-sm data-[selected=true]:border-accent/30 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground [&_svg]:text-muted data-[selected=true]:[&_svg]:text-accent">
    <Icon icon="gravity-ui:heart" />
    Save article
  </ToggleButton>
</template>
