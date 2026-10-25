<template>
  <div data-slot="avatar-group" :class="ui.base()">
    <Items />
  </div>
</template>

<script setup lang="ts">
import type { VNode } from 'vue'
import { cloneVNode, Comment, computed, Fragment, h } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type { AvatarGroupProps, AvatarGroupSlots } from './AvatarGroup.types'
import theme from './theme'

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  grid: false,
  overlap: 'clip',
})

const slots = defineSlots<AvatarGroupSlots>()

const ui = useComponentUI('avatarGroup', {
  theme,
  variantProps: () => ({
    grid: props.grid,
    overlap: props.overlap,
  }),
  props,
})

const flatten = (nodes: VNode[]): VNode[] => {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children))
      return flatten(node.children as VNode[])

    return node.type === Comment ? [] : [node]
  })
}

const groupProps = computed(() => ({
  size: props.size,
  color: props.color,
  variant: props.variant,
}))

/** Fills in the group's size/color/variant on direct Avatar children that omit them, like HeroUI's context. */
const inherit = (node: VNode): VNode => {
  if (node.type !== Avatar) return node
  const own = node.props ?? {}
  const extra = Object.fromEntries(
    Object.entries(groupProps.value).filter(
      ([key, value]) => value !== undefined && own[key] == null,
    ),
  )

  return Object.keys(extra).length ? cloneVNode(node, extra) : node
}

const Items = () => {
  const children = flatten(slots.default?.() ?? [])
  const visible = props.max == null ? children : children.slice(0, Math.max(0, props.max))
  const remaining = children.length - visible.length
  const nodes = visible.map(inherit)
  if (slots.count || remaining > 0) {
    nodes.push(
      h(
        Avatar,
        {
          ...groupProps.value,
          'data-slot': 'avatar-group-count',
          class: ui.value.count(),
        },
        { fallback: slots.count ?? (() => `+${remaining}`) },
      ),
    )
  }

  return nodes
}
</script>
