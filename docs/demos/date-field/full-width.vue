<script setup lang="ts">
import { DateField } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="w-[400px] space-y-4">
    <DateField full-width name="date" label="Date" />
    <DateField full-width name="date-icons" label="Date">
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:calendar" />
      </template>
      <template #suffix>
        <Icon class="size-4 text-muted" icon="gravity-ui:chevron-down" />
      </template>
    </DateField>
  </div>
</template>
