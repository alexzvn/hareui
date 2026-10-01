<script setup lang="ts">
import { NumberField } from 'herouse'
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField
      invalid
      required
      :min="0"
      name="quantity"
      :model-value="-5"
      label="Quantity"
      error-message="Quantity must be greater than or equal to 0"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      invalid
      :format-options="{ style: 'percent' }"
      :max="1"
      :min="0"
      name="percentage"
      :step="0.1"
      :model-value="1.5"
      label="Percentage"
      error-message="Percentage must be between 0 and 100"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>
