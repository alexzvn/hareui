<template>
  <div class="flex flex-col gap-4">
    <DateField
      invalid
      required
      class="w-[256px]"
      name="date"
      label="Date"
      error-message="Please enter a valid date"
    />
    <DateField
      invalid
      class="w-[256px]"
      name="invalid-date"
      label="Date"
      error-message="Date must be in the future"
    />
  </div>
</template>

<script setup lang="ts">
import { DateField } from '@hareui/vue'
</script>
