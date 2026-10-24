<script setup lang="ts">
import { ToggleButton } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <ToggleButton size="sm">
        <Icon icon="gravity-ui:heart" />
        Small
      </ToggleButton>
      <ToggleButton size="md">
        <Icon icon="gravity-ui:heart" />
        Medium
      </ToggleButton>
      <ToggleButton size="lg">
        <Icon icon="gravity-ui:heart" />
        Large
      </ToggleButton>
    </div>
    <div class="flex items-center gap-3">
      <ToggleButton icon-only aria-label="Like" size="sm">
        <Icon icon="gravity-ui:heart" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Like" size="md">
        <Icon icon="gravity-ui:heart" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Like" size="lg">
        <Icon icon="gravity-ui:heart" />
      </ToggleButton>
    </div>
  </div>
</template>
