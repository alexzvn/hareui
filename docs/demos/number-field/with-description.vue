<script setup lang="ts">
import { NumberField } from 'herouse'
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField :default-value="1024" :min="0" name="width" label="Width" description="Enter the width in pixels" :ui="{ input: 'w-[120px]' }" />
    <NumberField
      :default-value="0.5"
      :format-options="{ style: 'percent' }"
      :max="1"
      :min="0"
      name="percentage"
      :step="0.1"
      label="Percentage"
      description="Value must be between 0 and 100"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>
