<template>
  <Accordion class="w-full max-w-md" :items="items" multiple />
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'

const items: AccordionItem[] = [
  {
    label: 'Shipping',
    content:
      'Orders leave the warehouse within two working days. Tracking details arrive by email as soon as the parcel is on its way.',
  },
  {
    label: 'Returns',
    content:
      'Send unworn items back within 30 days. Print the prepaid label from your order page and drop the parcel at any post office.',
  },
  {
    label: 'Payment',
    content:
      'We take cards, bank transfers and gift vouchers. Your card is charged only when the order ships.',
  },
  {
    label: 'Warranty',
    content:
      'Every product carries a two-year warranty against manufacturing faults. Keep your receipt to make a claim.',
  },
]
</script>
