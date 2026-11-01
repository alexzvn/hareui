<template>
  <div class="flex flex-col gap-3">
    <div v-for="row in rows" :key="row.currency" class="flex items-baseline gap-4">
      <span class="w-12 text-xs text-muted">{{ row.currency }}</span>
      <NumberValue
        class="text-2xl font-semibold"
        :value="73904.5"
        format="currency"
        :currency="row.currency"
        :locale="row.locale"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

const rows = [
  { currency: 'USD', locale: 'en-US' },
  { currency: 'EUR', locale: 'de-DE' },
  { currency: 'INR', locale: 'en-IN' },
  { currency: 'KRW', locale: 'ko-KR' },
]
</script>
