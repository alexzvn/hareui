<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-baseline gap-4">
      <span class="w-36 text-xs text-muted">Compact currency</span>
      <NumberValue
        class="text-2xl font-semibold"
        :value="3_620_000"
        :options="{ style: 'currency', currency: 'USD', notation: 'compact' }"
      />
    </div>
    <div class="flex items-baseline gap-4">
      <span class="w-36 text-xs text-muted">Accounting</span>
      <NumberValue
        class="text-2xl font-semibold"
        :value="-815.4"
        format="currency"
        currency="USD"
        :options="{ currencySign: 'accounting' }"
      />
    </div>
    <div class="flex items-baseline gap-4">
      <span class="w-36 text-xs text-muted">Significant digits</span>
      <NumberValue
        class="text-2xl font-semibold"
        :value="0.000123456"
        :options="{ maximumSignificantDigits: 3 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'
</script>
