<template>
  <div class="flex w-full flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold">Frequently Asked Questions</h2>
      <p class="mb-4 text-lg font-medium text-muted">
        Everything you need to know about licensing and usage.
      </p>
    </div>
    <div v-for="category in categories" :key="category.title">
      <p class="text-md mb-2 font-medium text-muted">
        {{ category.title }}
      </p>
      <Accordion class="w-full" :items="category.items" variant="surface">
        <template #indicator>
          <Icon height="16" icon="gravity-ui:chevron-down" width="16" />
        </template>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type FaqCategory = {
  title: string
  items: AccordionItem[]
}

const categories: FaqCategory[] = [
  {
    items: [
      {
        content:
          "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
        label: 'How do I place an order?',
      },
      {
        content:
          "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
        label: 'Can I modify or cancel my order?',
      },
    ],
    title: 'General',
  },
  {
    items: [
      {
        content:
          'You can purchase a license directly from our website. Select the license type that fits your needs and proceed to checkout.',
        label: 'How do I purchase a license?',
      },
      {
        content:
          'A standard license is for personal use or small projects, while a pro license includes commercial use rights and priority support.',
        label: 'What is the difference between a standard and a pro license?',
      },
    ],
    title: 'Licensing',
  },
  {
    items: [
      {
        content:
          'You can reach our support team through the contact form on our website, or email us directly at support@example.com.',
        label: 'How do I get support?',
      },
    ],
    title: 'Support',
  },
]
</script>
