<template>
  <div class="w-[220px]">
    <NativeSelect
      invalid
      class="w-full"
      label="Delivery"
      name="delivery"
      placeholder="Delivery speed"
      error-message="Choose how you want your order delivered"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'standard', label: 'Standard (3–5 days)' },
  { value: 'express', label: 'Express (1–2 days)' },
  { value: 'pickup', label: 'Store pickup' },
]
</script>
