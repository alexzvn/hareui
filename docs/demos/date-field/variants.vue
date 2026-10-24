<script setup lang="ts">
import { DateField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField class="w-[256px]" name="primary-date" label="Primary variant" variant="primary" />
    <DateField
      class="w-[256px]"
      name="secondary-date"
      label="Secondary variant"
      variant="secondary"
    />
  </div>
</template>
