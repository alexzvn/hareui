<script setup lang="ts">
import { DateField, Surface } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Surface class="flex w-full max-w-sm flex-col gap-4 rounded-3xl p-6">
    <DateField class="w-full" variant="secondary" name="date" label="Date" description="Enter a date" />
    <DateField class="w-full" variant="secondary" name="date-2" label="Appointment date" description="Enter a date for your appointment">
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:calendar" />
      </template>
    </DateField>
  </Surface>
</template>
