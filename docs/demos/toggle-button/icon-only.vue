<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-3">
    <ToggleButton icon-only aria-label="Like">
      <Icon icon="gravity-ui:heart" />
    </ToggleButton>
    <ToggleButton icon-only aria-label="Bookmark" variant="ghost">
      <Icon icon="gravity-ui:bookmark" />
    </ToggleButton>
  </div>
</template>
