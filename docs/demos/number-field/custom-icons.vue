<template>
  <NumberField
    class="w-full max-w-64"
    :default-value="100"
    :min="25"
    :max="400"
    :step="25"
    name="zoom"
    label="Zoom"
    description="Percent of the actual size"
  >
    <template #decrement>
      <Icon icon="gravity-ui:magnifier-minus" class="size-4" />
    </template>
    <template #increment>
      <Icon icon="gravity-ui:magnifier-plus" class="size-4" />
    </template>
  </NumberField>
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
