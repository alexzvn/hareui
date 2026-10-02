<script setup lang="ts">
import type { ExpandedValue } from 'herouse'
import { Accordion, Button, useDisclosureGroupNavigation } from 'herouse'
import { ref } from 'vue'

const items = [
  { value: 'order', label: 'How do I place an order?', content: 'Browse our products, add items to your cart, and proceed to checkout.' },
  { value: 'modify', label: 'Can I modify or cancel my order?', content: 'Yes, you can modify or cancel your order before it\'s shipped.' },
  { value: 'payment', label: 'What payment methods do you accept?', content: 'We accept all major credit cards.' },
]
const withDisabled = [
  { label: 'Active Item', content: 'This item is active and can be toggled normally.' },
  { label: 'Disabled Item', content: 'This content cannot be accessed.', disabled: true },
  { label: 'Another Active Item', content: 'This item is also active.' },
]

const expanded = ref<ExpandedValue[]>(['order'])
const { isNextDisabled, isPrevDisabled, onNext, onPrevious } = useDisclosureGroupNavigation({
  expandedKeys: expanded,
  itemIds: items.map(item => item.value),
  onExpandedChange: (keys) => { expanded.value = keys },
})
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Accordion</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default</h2>
      <Accordion :items="items" class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">variant="surface"</h2>
      <Accordion :items="items" variant="surface" :default-value="['modify']" class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">hide-separator</h2>
      <Accordion :items="items" hide-separator class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">multiple</h2>
      <Accordion :items="items" multiple :default-value="['order', 'payment']" class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled (whole / per item)</h2>
      <div class="flex flex-col gap-4">
        <Accordion :items="items" disabled class="max-w-md" />
        <Accordion :items="withDisabled" class="max-w-md" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">v-model + useDisclosureGroupNavigation</h2>
      <div class="mb-2 flex items-center gap-2">
        <p class="text-xs text-muted">
          Expanded: <span class="font-mono font-medium text-foreground">{{ expanded.join(', ') || 'none' }}</span>
        </p>
        <Button size="sm" variant="secondary" :disabled="isPrevDisabled" @click="onPrevious">Prev</Button>
        <Button size="sm" variant="secondary" :disabled="isNextDisabled" @click="onNext">Next</Button>
      </div>
      <Accordion v-model="expanded" :items="items" class="max-w-md" />
    </section>
  </div>
</template>
