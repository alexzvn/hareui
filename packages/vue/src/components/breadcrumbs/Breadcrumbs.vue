<template>
  <Primitive :as="as" aria-label="Breadcrumbs" data-slot="breadcrumbs" :class="ui.base()">
    <li
      v-for="(item, index) in items"
      :key="index"
      data-slot="breadcrumbs-item"
      :data-current="index === items.length - 1 ? 'true' : undefined"
      :data-disabled="isInert(item, index) ? 'true' : undefined"
      :class="ui.item({ override: item.class })"
    >
      <!-- The current page is a non-interactive span, like React Aria's current Breadcrumb. -->
      <LinkResolver
        v-slot="link"
        :link="item"
        :button="isInert(item, index) || !hasLink(item)"
        fallback="span"
        :current="false"
      >
        <Link
          v-bind="link.attrs"
          :as="link.as"
          :disabled="isInert(item, index)"
          :role="link.as === 'span' ? 'link' : undefined"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          :data-current="index === items.length - 1 ? 'true' : undefined"
          :tabindex="isInert(item, index) ? undefined : 0"
          :class="ui.link()"
        >
          <IconRenderer
            v-if="item.icon"
            :icon="item.icon"
            data-slot="breadcrumbs-icon"
            :class="ui.icon()"
          />
          <slot name="item" :item="item" :index="index" :current="index === items.length - 1">
            {{ item.label }}
          </slot>
        </Link>
      </LinkResolver>
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
import { IconRenderer } from '@/utils/icon'
import { LinkResolver } from '@/utils/link'

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

const ui = useComponentUI('breadcrumbs', { theme: theme, variantProps: () => ({}), props })

// The current page (the last item) and disabled items render as a non-interactive `span`.
const isInert = (item: T, index: number) =>
  props.disabled || !!item.disabled || index === props.items.length - 1

const hasLink = (item: T) => item.to !== undefined || item.href !== undefined

const CHEVRON_RIGHT =
  'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z'

// HeroUI clones a custom separator element with the separator classes (React's `cloneElement`);
// anything else is rendered as-is, and no slot falls back to the chevron.
const Separator = (p: ItemSlotProps) => {
  const shared = {
    class: ui.value.separator(),
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
