<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <NumberField
      :default-value="99"
      :min="0"
      name="currency-eur"
      :format-options="{ currency: 'EUR', currencySign: 'accounting', style: 'currency' }"
      label="Currency (EUR - Accounting)"
      description="Accounting format with EUR currency"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      :default-value="99.99"
      :min="0"
      name="currency-usd"
      :format-options="{ currency: 'USD', style: 'currency' }"
      label="Currency (USD)"
      description="Standard USD currency format"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      :default-value="0.5"
      :min="0"
      :max="1"
      :step="0.01"
      name="percentage"
      :format-options="{ style: 'percent' }"
      label="Percentage"
      description="Percentage format (0-1, where 0.5 = 50%)"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      :default-value="1234.56"
      :min="0"
      name="decimal"
      :format-options="{ maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'decimal' }"
      label="Decimal (2 decimal places)"
      description="Decimal format with 2 decimal places"
      :ui="{ input: 'w-[120px]' }"
    />
    <NumberField
      :default-value="1000"
      :min="0"
      name="unit"
      :format-options="{ style: 'unit', unit: 'kilogram', unitDisplay: 'short' }"
      label="Unit (Kilograms)"
      description="Unit format with kilograms"
      :ui="{ input: 'w-[120px]' }"
    />
  </div>
</template>

<script setup lang="ts">
import { NumberField } from '@hareui/vue'
</script>
