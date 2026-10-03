<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <NumberField
    class="w-full max-w-48"
    :default-value="2"
    :min="1"
    name="guests"
    variant="secondary"
    label="Guests"
    :ui="{
      group: 'rounded-xl bg-default',
      decrementButton: 'text-muted hover:text-foreground',
      input: 'text-center tabular-nums',
      incrementButton: 'text-muted hover:text-foreground',
    }"
  />
</template>
