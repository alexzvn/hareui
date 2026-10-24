<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <NumberField
      :default-value="100"
      :min="0"
      name="primary-width"
      variant="primary"
      label="Primary variant"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      :default-value="100"
      :min="0"
      name="secondary-width"
      variant="secondary"
      label="Secondary variant"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>
