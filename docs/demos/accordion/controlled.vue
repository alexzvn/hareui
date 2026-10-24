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

interface Section extends AccordionItem {
  value: string
}

const items: Section[] = [
  {
    content:
      'Learn the basics of HeroUI and how to integrate it into your React project. This section covers installation, setup, and your first component.',
    value: 'getting-started',
    label: 'Getting Started',
  },
  {
    content:
      'Understand the fundamental concepts behind HeroUI, including the compound component pattern, styling with Tailwind CSS, and accessibility features.',
    value: 'core-concepts',
    label: 'Core Concepts',
  },
  {
    content:
      'Explore advanced features like custom variants, theme customization, and integration with other libraries in your React ecosystem.',
    value: 'advanced-usage',
    label: 'Advanced Usage',
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
