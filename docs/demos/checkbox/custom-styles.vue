<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
</script>

<template>
  <Checkbox
    id="custom"
    label="Custom styled checkbox"
    :ui="{
      control: 'bg-success-soft before:bg-success',
      indicator: '**:data-[slot=checkbox-default-indicator--checkmark]:text-success-foreground',
    }"
  />
</template>
