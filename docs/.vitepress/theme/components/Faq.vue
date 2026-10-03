<script setup lang="ts">
import type { VNode } from 'vue'
import { Accordion } from '@hareui/vue'
import { Fragment, useSlots } from 'vue'
import FaqItem from './FaqItem.vue'

// Renders markdown <FaqItem question="…"> children as a HareUI Accordion. The heading is
// not-prose so the trigger keeps the component's own type styles; answers keep prose styling.
const slots = useSlots()

function faqItems(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === FaqItem) return [node]
    if (node.type === Fragment && Array.isArray(node.children)) return faqItems(node.children as VNode[])
    return []
  })
}

function entries() {
  return faqItems(slots.default?.() ?? []).map((node, index) => ({
    label: (node.props as { question: string }).question,
    slot: `faq-${index}`,
    node,
  }))
}
</script>

<template>
  <Accordion
    :items="entries()"
    variant="surface"
    :ui="{ heading: 'not-prose', bodyInner: '[&>:first-child]:mt-0 [&>:last-child]:mb-0' }"
  >
    <template v-for="entry in entries()" :key="entry.slot" #[entry.slot]>
      <component :is="entry.node" />
    </template>
  </Accordion>
</template>
