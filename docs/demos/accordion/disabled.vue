<template>
  <div class="flex w-full flex-col items-center gap-8">
    <div class="w-full max-w-md space-y-2">
      <h3 class="text-sm font-medium text-muted">Entire accordion disabled</h3>
      <Accordion class="w-full max-w-md" disabled :items="disabledItems" />
    </div>

    <div class="w-full max-w-md space-y-2">
      <h3 class="text-sm font-medium text-muted">Individual items disabled</h3>
      <Accordion class="w-full max-w-md" :items="items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'

const disabledItems: AccordionItem[] = [
  {
    label: 'Disabled Item 1',
    content: 'This content cannot be accessed when the accordion is disabled.',
  },
  {
    label: 'Disabled Item 2',
    content: 'This content cannot be accessed when the accordion is disabled.',
  },
]

const items: AccordionItem[] = [
  { label: 'Active Item', content: 'This item is active and can be toggled normally.' },
  {
    label: 'Disabled Item',
    content: 'This content cannot be accessed when the item is disabled.',
    disabled: true,
  },
  { label: 'Another Active Item', content: 'This item is also active and can be toggled.' },
]
</script>
