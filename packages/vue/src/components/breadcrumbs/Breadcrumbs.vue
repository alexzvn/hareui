<template>
  <Primitive
    :as="as"
    aria-label="Breadcrumbs"
    data-slot="breadcrumbs"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      data-slot="breadcrumbs-item"
      :data-current="index === items.length - 1 ? 'true' : undefined"
      :data-disabled="disabled || index === items.length - 1 ? 'true' : undefined"
      :class="ui.item({ class: [props.ui?.item, item.class] })"
    >
      <!-- The current page is a non-interactive span, like React Aria's current Breadcrumb. -->
      <Link
        :as="index === items.length - 1 || disabled || !item.href ? 'span' : 'a'"
        :href="index === items.length - 1 ? undefined : item.href"
        :disabled="disabled || index === items.length - 1"
        :role="index === items.length - 1 || disabled || !item.href ? 'link' : undefined"
        :aria-current="index === items.length - 1 ? 'page' : undefined"
        :data-current="index === items.length - 1 ? 'true' : undefined"
        :tabindex="index === items.length - 1 || disabled ? undefined : 0"
        :class="ui.link({ class: props.ui?.link })"
      >
        <slot name="item" :item="item" :index="index" :current="index === items.length - 1">
          {{ item.label }}
        </slot>
      </Link>
      <Separator v-if="index < items.length - 1" :item="item" :index="index" :current="false" />
    </li>
  </Primitive>
</template>

<script setup lang="ts" generic="T extends BreadcrumbsItem = BreadcrumbsItem">
import { Primitive } from 'reka-ui'
import type { VNode } from 'vue'
import { cloneVNode, Comment, h, isVNode, useSlots } from 'vue'

import Link from '@/components/link/Link.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type {
  BreadcrumbsItem,
  BreadcrumbsProps,
  BreadcrumbsSlots,
  ItemSlotProps,
} from './Breadcrumbs.types'
import theme from './theme'

const props = withDefaults(defineProps<BreadcrumbsProps<T>>(), { as: 'ol' })
const slots = useSlots()
defineSlots<BreadcrumbsSlots<T>>()

const ui = useComponentUI('breadcrumbs', { theme: theme, variantProps: () => ({}) })

const CHEVRON_RIGHT =
  'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z'

// HeroUI clones a custom separator element with the separator classes (React's `cloneElement`);
// anything else is rendered as-is, and no slot falls back to the chevron.
const Separator = (p: ItemSlotProps) => {
  const shared = {
    class: ui.value.separator({ class: props.ui?.separator }),
    'data-slot': 'breadcrumbs-separator',
  }

  if (slots.separator) {
    const nodes = slots.separator(p).filter((v: VNode) => v.type !== Comment)
    const isSingleElement =
      nodes.length === 1 && isVNode(nodes[0]) && typeof nodes[0].type !== 'symbol'

    return isSingleElement ? cloneVNode(nodes[0], shared, true) : nodes
  }

  return h(
    'svg',
    {
      ...shared,
      'aria-hidden': 'true',
      fill: 'none',
      height: '16',
      role: 'presentation',
      viewBox: '0 0 16 16',
      width: '16',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'clip-rule': 'evenodd',
        d: CHEVRON_RIGHT,
        fill: 'currentColor',
        'fill-rule': 'evenodd',
      }),
    ],
  )
}
</script>
