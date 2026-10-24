<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const deliverySlots = [
  { value: 'morning', title: 'Morning', description: '8:00 – 12:00', fee: 2.5 },
  { value: 'afternoon', title: 'Afternoon', description: '12:00 – 17:00', fee: 0 },
  { value: 'evening', title: 'Evening', description: '17:00 – 21:00', fee: 3.9 },
]

const payments = [
  {
    value: 'card',
    title: 'Card ending 4417',
    description: 'Expires 09/2029',
    icon: 'gravity-ui:credit-card',
  },
  {
    value: 'wallet',
    title: 'Store balance',
    description: '€42.60 available',
    icon: 'gravity-ui:wallet',
  },
  {
    value: 'voucher',
    title: 'Gift voucher',
    description: 'Enter a code at checkout',
    icon: 'gravity-ui:gift',
  },
  {
    value: 'cash',
    title: 'Pay on delivery',
    description: 'Card or cash to the courier',
    icon: 'gravity-ui:hand-ok',
  },
]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
</script>

<template>
  <div class="flex w-full max-w-lg flex-col items-center gap-10">
    <section class="flex w-full flex-col gap-4">
      <RadioButtonGroup
        class="grid-cols-1 sm:grid-cols-3"
        default-value="afternoon"
        layout="grid"
        name="delivery-slot"
        variant="secondary"
        label="Delivery slot"
      >
        <RadioButtonGroupItem
          v-for="option in deliverySlots"
          :key="option.value"
          :value="option.value"
          :label="option.title"
          :description="option.description"
          :ui="{ itemDescription: 'mt-1' }"
        >
          <span class="mt-2 text-sm font-semibold">{{
            option.fee ? eur.format(option.fee) : 'Free'
          }}</span>
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </section>
    <section class="flex w-full flex-col gap-4">
      <RadioButtonGroup
        class="grid-cols-1 sm:grid-cols-2"
        default-value="card"
        layout="grid"
        name="payment"
        variant="secondary"
        label="Payment"
      >
        <RadioButtonGroupItem
          v-for="payment in payments"
          :key="payment.value"
          :value="payment.value"
          :label="payment.title"
          :description="payment.description"
          :icon="() => h(Icon, { icon: payment.icon })"
          :indicator="false"
          :ui="{ content: 'items-start' }"
        />
      </RadioButtonGroup>
    </section>
  </div>
</template>
