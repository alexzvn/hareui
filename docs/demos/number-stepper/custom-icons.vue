<template>
  <NumberStepper aria-label="Editor font size" :default-value="14" :min="10" :max="24">
    <template #decrement>
      <Icon icon="gravity-ui:chevron-down" />
    </template>
    <template #increment>
      <Icon icon="gravity-ui:chevron-up" />
    </template>
  </NumberStepper>
</template>

<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
