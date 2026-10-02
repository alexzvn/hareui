<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-3">
    <ToggleButton disabled>
      <Icon icon="gravity-ui:heart" />
      Like
    </ToggleButton>
    <ToggleButton default-value disabled>
      <Icon icon="gravity-ui:heart-fill" />
      Like
    </ToggleButton>
  </div>
</template>
