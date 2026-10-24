<template>
  <DateField
    class="w-64"
    name="due-date"
    label="Due date"
    variant="secondary"
    :ui="{ group: 'rounded-xl border border-border/80 bg-default shadow-sm' }"
  />
</template>

<script setup lang="ts">
import { DateField } from '@hareui/vue'
</script>
