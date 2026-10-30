<template>
  <div class="w-full max-w-md">
    <div class="mb-4 flex items-center justify-between">
      <p class="text-sm text-muted">
        Expanded: <strong>{{ expandedKeys.join(', ') || 'none' }}</strong>
      </p>
      <div class="flex gap-2">
        <Button
          aria-label="Previous item"
          :disabled="isPrevDisabled"
          size="sm"
          variant="secondary"
          @click="onPrevious"
        >
          <Icon class="size-4" icon="gravity-ui:chevron-up" />
        </Button>
        <Button
          aria-label="Next item"
          :disabled="isNextDisabled"
          size="sm"
          variant="secondary"
          @click="onNext"
        >
          <Icon class="size-4" icon="gravity-ui:chevron-down" />
        </Button>
      </div>
    </div>
    <Accordion v-model="expandedKeys" :items="items" />
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem, ExpandedValue } from '@hareui/vue'
import { Accordion, Button, useDisclosureGroupNavigation } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

type Section = {
  value: string
} & AccordionItem

const items: Section[] = [
  {
    content:
      'Pack light layers, a rain shell and shoes you have already broken in. The trail is muddy after the first bridge.',
    value: 'getting-started',
    label: 'What to Bring',
  },
  {
    content:
      'The loop climbs 600 metres over 14 kilometres. Most walkers finish in five to six hours, breaks included.',
    value: 'core-concepts',
    label: 'Route and Distance',
  },
  {
    content:
      'Buses leave the station every 40 minutes until 18:00. Parking at the trailhead fills up by nine on weekends.',
    value: 'advanced-usage',
    label: 'Getting There',
  },
]

const expandedKeys = ref<ExpandedValue[]>(['getting-started'])

const { isNextDisabled, isPrevDisabled, onNext, onPrevious } = useDisclosureGroupNavigation({
  expandedKeys,
  itemIds: items.map((item) => item.value),
  onExpandedChange: (keys) => {
    expandedKeys.value = keys
  },
})
</script>
