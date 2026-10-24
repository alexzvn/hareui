<script setup lang="ts">
import { ToggleButton } from '@hareui/vue'
import { Icon } from '@iconify/vue'
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
