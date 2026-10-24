<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField required :min="0" name="quantity" label="Quantity" :ui="{ input: 'w-[120px]' }" />
    <NumberField
      required
      :default-value="1"
      :max="10"
      :min="1"
      name="rating"
      label="Rating"
      description="Rate from 1 to 10"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>
