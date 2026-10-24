<template>
  <div class="flex flex-col gap-4">
    <TimeField
      class="w-[256px]"
      name="time"
      label="Start time"
      description="Enter the start time"
    />
    <TimeField
      class="w-[256px]"
      name="end-time"
      label="End time"
      description="Enter the end time"
    />
  </div>
</template>

<script setup lang="ts">
import { TimeField } from '@hareui/vue'
</script>
