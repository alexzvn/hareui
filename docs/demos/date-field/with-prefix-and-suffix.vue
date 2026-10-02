<script setup lang="ts">
import { DateField } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <DateField class="w-[256px]" name="date" label="Date" description="Enter a date">
    <template #prefix>
      <Icon class="size-4 text-muted" icon="gravity-ui:calendar" />
    </template>
    <template #suffix>
      <Icon class="size-4 text-muted" icon="gravity-ui:chevron-down" />
    </template>
  </DateField>
</template>
