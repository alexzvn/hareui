<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField :default-value="0" :max="100" :min="0" name="step1" :step="1" label="Step: 1" description="Increments by 1" :ui="{ input: 'w-[120px]' }" />
    <NumberField :default-value="0" :max="100" :min="0" name="step5" :step="5" label="Step: 5" description="Increments by 5" :ui="{ input: 'w-[120px]' }" />
    <NumberField :default-value="0" :max="100" :min="0" name="step10" :step="10" label="Step: 10" description="Increments by 10" :ui="{ input: 'w-[120px]' }" />
  </div>
</template>
