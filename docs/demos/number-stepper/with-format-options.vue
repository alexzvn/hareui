<template>
  <div class="flex flex-col gap-5">
    <NumberStepper
      label="Tip"
      locale="de-DE"
      :default-value="4.5"
      :min="0"
      :step="0.5"
      :format-options="{ style: 'currency', currency: 'EUR' }"
    />
    <NumberStepper
      label="Run distance"
      :default-value="5"
      :min="1"
      :max="42"
      :format-options="{ style: 'unit', unit: 'kilometer' }"
    />
    <NumberStepper
      label="Battery saver at"
      :default-value="0.2"
      :min="0.05"
      :max="0.5"
      :step="0.05"
      :format-options="{ style: 'percent' }"
    />
  </div>
</template>

<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>
