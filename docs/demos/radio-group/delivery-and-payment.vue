<template>
  <div
    class="flex w-full flex-col items-center gap-10"
    style="
      --accent: #006fee;
      --accent-foreground: #fff;
      --accent-hover: #006fee;
      --border-width: 2px;
      --border-width-field: 2px;
      --focus: #006fee;
    "
  >
    <section class="flex w-full max-w-lg flex-col gap-4">
      <RadioGroup
        default-value="express"
        name="delivery"
        variant="secondary"
        label="Delivery method"
        :items="deliveryOptions.map(({ label, value }) => ({ label, value }))"
        :ui="{ base: deliveryBase, content: deliveryContent, control }"
      >
        <template #item-label="{ index }">
          <div class="flex flex-col gap-1">
            <span>{{ deliveryOptions[index]!.label }}</span>
            <Description>{{ deliveryOptions[index]!.description }}</Description>
          </div>
          <span class="text-sm font-semibold">{{ deliveryOptions[index]!.price }}</span>
        </template>
      </RadioGroup>
    </section>
    <section class="flex w-full max-w-lg flex-col gap-4">
      <RadioGroup
        default-value="visa"
        name="payment"
        variant="secondary"
        label="Payment method"
        :items="paymentOptions.map(({ label, value }) => ({ label, value }))"
        :ui="{ base: paymentBase, content: paymentContent, control }"
      >
        <template #item-label="{ index }">
          <Icon class="size-6" :icon="paymentOptions[index]!.icon" />
          <div class="flex flex-col gap-1">
            <span>{{ paymentOptions[index]!.label }}</span>
            <Description>{{ paymentOptions[index]!.description }}</Description>
          </div>
        </template>
      </RadioGroup>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Description, RadioGroup } from '@hareui/vue'
import type { IconifyIcon } from '@iconify/vue'
import { Icon } from '@iconify/vue'

type DeliveryOption = {
  price: string
} & RadioGroupItem

const deliveryOptions: DeliveryOption[] = [
  { description: '4-10 business days', price: '$5.00', label: 'Standard', value: 'standard' },
  { description: '2-5 business days', price: '$16.00', label: 'Express', value: 'express' },
  { description: '1 business day', price: '$25.00', label: 'Super Fast', value: 'super-fast' },
]

// `uim:master-card`, `streamline-logos:visa-logo-solid`, `ic:baseline-paypal` (Iconify), inlined so the
// docs stay offline-capable with only the gravity-ui collection bundled.
const mastercard: IconifyIcon = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" d="M15.273 18.728A6.728 6.728 0 1 1 22 11.999V12a6.735 6.735 0 0 1-6.727 6.728" opacity=".5"/><path fill="currentColor" d="M8.727 18.728A6.728 6.728 0 1 1 15.455 12a6.735 6.735 0 0 1-6.728 6.728"/>',
}
const visa: IconifyIcon = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" fill-rule="evenodd" d="M1 8.5h2.698a1 1 0 0 1 .976.783L5.5 13L7 8.5h2l-2.5 7h-2L3 9.5zm9 0h1.5l-1 7H9zm5.003 0c.8 0 1.62.124 1.954.291l-.236 1.426c-.303-.165-.99-.31-1.648-.31s-.846.415-.846.595c0 .247.333.424.756.648c.734.39 1.738.923 1.738 2.217c0 1.502-1.902 2.133-2.903 2.133c-.8 0-1.778-.124-2.112-.291l.235-1.426c.299.103 1.123.333 1.781.333c.66 0 1.147-.333 1.147-.618c0-.426-.422-.646-.915-.903c-.694-.362-1.529-.797-1.529-1.985c0-1.502 1.577-2.11 2.578-2.11m1.497 7h2l.343-1h2.29l.223 1H23l-1.5-7h-2zm4.311-2.502h-1.48l.936-2.527z" clip-rule="evenodd"/>',
}
const paypal: IconifyIcon = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" d="M9.93 12.99c.1 0 2.42.1 3.8-.24h.01c1.59-.39 3.8-1.51 4.37-5.17c0 0 1.27-4.58-5.03-4.58H7.67c-.49 0-.91.36-.99.84L4.38 18.4c-.05.3.19.58.49.58H8.3l.84-5.32c.06-.38.39-.67.79-.67"/><path fill="currentColor" d="M18.99 8.29c-.81 3.73-3.36 5.7-7.42 5.7H10.1l-1.03 6.52c-.04.26.16.49.42.49h1.9c.34 0 .64-.25.69-.59c.08-.4.52-3.32.61-3.82c.05-.34.35-.59.69-.59h.44c2.82 0 5.03-1.15 5.68-4.46c.26-1.34.12-2.44-.51-3.25"/>',
}

type PaymentOption = {
  icon: IconifyIcon
} & RadioGroupItem

const paymentOptions: PaymentOption[] = [
  { description: 'Exp. on 01/2026', icon: mastercard, label: '**** 8304', value: 'mastercard' },
  { description: 'Exp. on 01/2026', icon: visa, label: '**** 0123', value: 'visa' },
  { description: 'Pay with PayPal', icon: paypal, label: 'PayPal', value: 'paypal' },
]

// HeroUI wraps the radios in `<div class="grid gap-x-4 md:grid-cols-N">`; the group root takes that grid here,
// with the label spanning every column.
const deliveryBase = 'grid gap-x-4 md:grid-cols-3 [&>[data-slot=label]]:col-span-full'
const paymentBase = 'grid gap-x-4 md:grid-cols-2 [&>[data-slot=label]]:col-span-full'

const deliveryContent = [
  'group relative flex w-full flex-col gap-6 rounded-xl border border-transparent bg-surface px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10',
  'focus-visible:border-accent focus-visible:bg-accent/10',
]
const paymentContent = [
  'group relative flex w-full flex-row items-start justify-start gap-4 rounded-xl border border-transparent bg-surface px-5 py-4 transition-all',
  'data-[selected=true]:border-accent data-[selected=true]:bg-accent/10',
]
const control = 'absolute end-4 top-3 size-5'
</script>
