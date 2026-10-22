<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-5">
    <NumberStepper
      label="Focus timer"
      description="Steps of 15 minutes"
      :default-value="30"
      :min="15"
      :max="120"
      :step="15"
      :format-options="{ style: 'unit', unit: 'minute' }"
    />
    <NumberStepper
      label="Barbell load"
      description="Steps of 2.5 kg"
      :default-value="40"
      :min="20"
      :max="200"
      :step="2.5"
      :format-options="{ style: 'unit', unit: 'kilogram' }"
    />
  </div>
</template>
