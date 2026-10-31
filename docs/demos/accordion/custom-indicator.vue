<template>
  <Accordion v-model="expandedKeys" class="w-full max-w-md" :items="items" variant="surface">
    <template #indicator="{ item, open }">
      <Icon v-if="item.indicator" height="16" :icon="item.indicator" width="16" />
      <Icon v-else height="16" :icon="open ? 'gravity-ui:minus' : 'gravity-ui:plus'" width="16" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { AccordionItem, ExpandedValue } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

type IndicatorItem = {
  indicator?: string
} & AccordionItem

const items: IndicatorItem[] = [
  {
    value: '1',
    label: 'Using Plus/Minus Icon',
    content:
      'This accordion uses a plus icon that transforms when expanded. The icon automatically rotates 45 degrees to form an X.',
  },
  {
    value: '2',
    label: 'Using Caret Icon',
    indicator: 'gravity-ui:circle-chevron-down',
    content:
      'This item uses a caret icon for the indicator. The rotation animation is applied automatically.',
  },
  {
    value: '3',
    label: 'Using Arrow Icon',
    indicator: 'gravity-ui:chevrons-down',
    content:
      'This item uses an arrow icon. Any icon you pass will receive the rotation animation when the item expands.',
  },
]

const expandedKeys = ref<ExpandedValue[]>([''])
</script>
