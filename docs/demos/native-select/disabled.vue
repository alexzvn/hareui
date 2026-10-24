<template>
  <div class="w-[220px]">
    <NativeSelect
      disabled
      full-width
      label="Billing cycle"
      name="billing-cycle"
      default-value="yearly"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]
</script>
