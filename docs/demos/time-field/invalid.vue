<script setup lang="ts">
import { TimeField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <TimeField invalid required class="w-[256px]" name="time" label="Time" error-message="Please enter a valid time" />
    <TimeField invalid class="w-[256px]" name="invalid-time" label="Time" error-message="Time must be within business hours" />
  </div>
</template>
