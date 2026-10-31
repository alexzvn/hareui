<template>
  <Accordion class="w-full max-w-md" :items="items" />
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: AccordionItem[] = [
  {
    value: 'shipping',
    label: 'Shipping',
    icon: icon('box'),
    content: 'Orders leave the warehouse within two working days.',
  },
  {
    value: 'returns',
    label: 'Returns',
    icon: icon('arrow-rotate-left'),
    content: 'Send items back within 30 days for a full refund.',
  },
  {
    value: 'payment',
    label: 'Payment',
    icon: icon('credit-card'),
    content: 'We accept cards, bank transfers and gift vouchers.',
  },
]
</script>
