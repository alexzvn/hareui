<template>
  <div class="flex w-fit flex-col items-end gap-1">
    <NumberValue
      v-for="amount in amounts"
      :key="amount"
      class="text-xl font-semibold"
      :value="amount"
      format="currency"
      currency="USD"
    />
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

const amounts = [118_204.5, 9_871.25, 61_110, 4_444.44, 707_070.7]
</script>
