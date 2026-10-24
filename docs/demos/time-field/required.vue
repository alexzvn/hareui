<script setup lang="ts">
import { TimeField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <TimeField required class="w-[256px]" name="time" label="Time" />
    <TimeField
      required
      class="w-[256px]"
      name="appointment-time"
      label="Appointment time"
      description="Required field"
    />
  </div>
</template>
