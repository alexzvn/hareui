<script setup lang="ts">
import { Surface, TimeField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Surface class="flex w-full max-w-sm flex-col gap-4 rounded-3xl p-6">
    <TimeField
      class="w-full"
      variant="secondary"
      name="time"
      label="Time"
      description="Enter a time"
    />
    <TimeField
      class="w-full"
      variant="secondary"
      name="time-2"
      label="Appointment time"
      description="Enter a time for your appointment"
    >
      <template #prefix>
        <Icon class="size-4 text-muted" icon="gravity-ui:clock" />
      </template>
    </TimeField>
  </Surface>
</template>
