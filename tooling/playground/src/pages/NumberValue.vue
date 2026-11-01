<script setup lang="ts">
import { App, NumberValue } from '@hareui/vue'
import { onBeforeUnmount, ref } from 'vue'

const ticking = ref(4821.37)
const timer = setInterval(() => {
  ticking.value = Math.round((ticking.value + (Math.random() - 0.5) * 40) * 100) / 100
}, 500)

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">NumberValue</h1>

    <section class="flex flex-wrap items-baseline gap-6">
      <h2 class="w-24 text-sm text-muted">Decimal</h2>
      <NumberValue :value="1234567.891" />
      <NumberValue :value="1234567.891" :maximum-fraction-digits="0" />
      <NumberValue :value="3" :minimum-fraction-digits="2" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6 text-2xl font-semibold">
      <h2 class="w-24 text-sm font-normal text-muted">Currency</h2>
      <NumberValue :value="84210" format="currency" currency="USD" />
      <NumberValue :value="84210" format="currency" currency="EUR" locale="de-DE" />
      <NumberValue :value="84210" format="currency" currency="JPY" locale="ja-JP" />
      <NumberValue :value="84210" format="currency" currency="GBP" locale="en-GB" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6 text-2xl font-semibold">
      <h2 class="w-24 text-sm font-normal text-muted">Percent</h2>
      <NumberValue :value="0.072" format="percent" :maximum-fraction-digits="1" />
      <NumberValue :value="0.9925" format="percent" :minimum-fraction-digits="2" />
      <NumberValue :value="0.072" format="percent" :maximum-fraction-digits="1" locale="fr-FR" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6 text-2xl font-semibold">
      <h2 class="w-24 text-sm font-normal text-muted">Compact</h2>
      <NumberValue :value="980" notation="compact" />
      <NumberValue :value="12_400" notation="compact" />
      <NumberValue :value="3_750_000" notation="compact" />
      <NumberValue :value="3_750_000" notation="compact" locale="de-DE" />
      <NumberValue :value="2_100_000_000" notation="compact" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6">
      <h2 class="w-24 text-sm text-muted">Unit</h2>
      <NumberValue :value="18.4" format="unit" unit="celsius" />
      <NumberValue :value="512" format="unit" unit="megabyte" />
      <NumberValue :value="88" format="unit" unit="kilometer-per-hour" :options="{ unitDisplay: 'long' }" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6">
      <h2 class="w-24 text-sm text-muted">Sign</h2>
      <NumberValue v-for="value in [12, 0, -12]" :key="`auto${value}`" :value="value" />
      <NumberValue v-for="value in [12, 0, -12]" :key="`always${value}`" :value="value" sign-display="always" />
      <NumberValue v-for="value in [12, 0, -12]" :key="`except${value}`" :value="value" sign-display="exceptZero" />
      <NumberValue v-for="value in [12, 0, -12]" :key="`never${value}`" :value="value" sign-display="never" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6 text-2xl font-semibold">
      <h2 class="w-24 text-sm font-normal text-muted">Options</h2>
      <NumberValue :value="-2450.5" :options="{ style: 'currency', currency: 'USD', currencySign: 'accounting' }" />
      <NumberValue :value="1_480_000" format="currency" currency="USD" :options="{ notation: 'compact', currency: 'CAD' }" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6 text-2xl font-semibold">
      <h2 class="w-24 text-sm font-normal text-muted">Slots</h2>
      <NumberValue :value="19" format="currency" currency="USD">
        <template #prefix><span class="text-sm font-normal text-muted">from </span></template>
        <template #suffix><span class="text-sm font-normal text-muted">/seat</span></template>
      </NumberValue>
      <NumberValue :value="0.42" format="percent">
        <template #default="{ formatted, value }">
          <span :class="value > 0.4 ? 'text-success' : 'text-danger'">{{ formatted }}</span>
        </template>
      </NumberValue>
    </section>

    <section class="flex flex-col items-end gap-1 text-xl font-semibold w-fit">
      <h2 class="self-start text-sm font-normal text-muted">Tabular numerals (ticking)</h2>
      <NumberValue :value="ticking" format="currency" currency="USD" />
      <NumberValue :value="1111.11" format="currency" currency="USD" />
      <NumberValue :value="8888.88" format="currency" currency="USD" />
    </section>

    <section class="flex flex-wrap items-baseline gap-6">
      <h2 class="w-24 text-sm text-muted">App locale</h2>
      <App locale="de-CH" :toaster="null">
        <NumberValue :value="1234567.5" />
        <NumberValue class="ml-4" :value="1234567.5" locale="en-IN" />
      </App>
    </section>

    <section class="flex flex-wrap items-baseline gap-6">
      <h2 class="w-24 text-sm text-muted">:ui override</h2>
      <NumberValue
        :value="0.15"
        format="percent"
        :ui="{ base: 'text-lg font-semibold', value: 'text-accent', suffix: 'text-xs text-muted' }"
      >
        <template #suffix> off</template>
      </NumberValue>
    </section>
  </div>
</template>
