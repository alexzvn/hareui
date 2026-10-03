<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-3">
    <ToggleButton>
      <Icon icon="gravity-ui:heart" />
      Default
    </ToggleButton>
    <ToggleButton variant="ghost">
      <Icon icon="gravity-ui:heart" />
      Ghost
    </ToggleButton>
  </div>
</template>
