<template>
  <Accordion class="w-full max-w-md" :items="items">
    <template #leading="{ item }">
      <span class="me-3 size-4 shrink-0 text-muted"
        ><Icon :icon="item.icon" height="16" width="16"
      /></span>
    </template>
    <template #indicator>
      <Icon height="16" icon="gravity-ui:chevron-down" width="16" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type FaqItem = {
  icon: string
} & AccordionItem

const items: FaqItem[] = [
  {
    content:
      "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
    icon: 'gravity-ui:shopping-bag',
    label: 'How do I place an order?',
  },
  {
    content:
      "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
    icon: 'gravity-ui:receipt',
    label: 'Can I modify or cancel my order?',
  },
  {
    content: 'We accept all major credit cards, including Visa, Mastercard, and American Express.',
    icon: 'gravity-ui:credit-card',
    label: 'What payment methods do you accept?',
  },
  {
    content:
      'Shipping costs vary based on your location and the size of your order. We offer free shipping for orders over $50.',
    icon: 'gravity-ui:box',
    label: 'How much does shipping cost?',
  },
  {
    content:
      'Yes, we ship to most countries. Please check our shipping rates and policies for more information.',
    icon: 'gravity-ui:planet-earth',
    label: 'Do you ship internationally?',
  },
  {
    content:
      "If you're not satisfied with your purchase, you can request a refund within 30 days of purchase. Please contact our customer support team for assistance.",
    icon: 'gravity-ui:arrows-rotate-left',
    label: 'How do I request a refund?',
  },
]
</script>
