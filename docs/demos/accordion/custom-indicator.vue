<template>
  <Accordion class="w-full max-w-md" :items="items" variant="surface">
    <template #indicator="{ item, open }">
      <Icon v-if="item.indicator" height="16" :icon="item.indicator" width="16" />
      <Icon v-else height="16" :icon="open ? 'gravity-ui:minus' : 'gravity-ui:plus'" width="16" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type IndicatorItem = {
  indicator?: string
} & AccordionItem

const items: IndicatorItem[] = [
  {
    value: 'plus-minus',
    label: 'Plus and minus',
    content: 'The slot swaps a plus for a minus while the item is open.',
  },
  {
    value: 'circle',
    label: 'Circled chevron',
    indicator: 'gravity-ui:circle-chevron-down',
    content: 'A single icon turns upside down while the item is open.',
  },
  {
    value: 'double',
    label: 'Double chevron',
    indicator: 'gravity-ui:chevrons-down',
    content: 'Any icon you put in the slot gets the same rotation.',
  },
]
</script>
