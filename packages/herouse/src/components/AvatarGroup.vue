<script lang="ts">
import type { VNode } from 'vue'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import type { AvatarProps } from './Avatar.vue'
import theme from '../theme/avatarGroup'

type AvatarGroup = typeof theme

export interface AvatarGroupProps {
  /**
   * Size applied to child Avatars (and the overflow count) that don't set `size`.
   * @defaultValue 'md'
   */
  size?: AvatarProps['size']
  /** Color applied to child Avatars (and the overflow count) that don't set `color`. */
  color?: AvatarProps['color']
  /** Variant applied to child Avatars (and the overflow count) that don't set `variant`. */
  variant?: AvatarProps['variant']
  /** Maximum number of Avatars to render; the rest are counted in a `+N` avatar. Omit to show all. */
  max?: number
  /**
   * Wrapping grid layout without overlap.
   * @defaultValue false
   */
  grid?: boolean
  /**
   * Stacked overlap style: crescent clip or box-shadow ring. Ignored with `grid`.
   * @defaultValue 'clip'
   */
  overlap?: ComponentVariants<AvatarGroup>['overlap']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AvatarGroup>
}

export interface AvatarGroupSlots {
  /** The `Avatar` components. Only direct `Avatar` children inherit `size`, `color` and `variant`. */
  default?: () => VNode[]
  /**
   * Content of an explicit overflow-count avatar (e.g. `+9` for a known total). It is not
   * truncated by `max` and replaces the automatic count.
   */
  count?: () => any
}
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, Fragment, h } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Avatar from './Avatar.vue'

const props = withDefaults(defineProps<AvatarGroupProps>(), { size: 'md', grid: false, overlap: 'clip' })
const slots = defineSlots<AvatarGroupSlots>()

const ui = useComponentUI('avatarGroup', theme, () => ({ grid: props.grid, overlap: props.overlap }))

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children))
      return flatten(node.children as VNode[])
    return node.type === Comment ? [] : [node]
  })
}

const groupProps = computed(() => ({ size: props.size, color: props.color, variant: props.variant }))

/** Fills in the group's size/color/variant on direct Avatar children that omit them, like HeroUI's context. */
function inherit(node: VNode): VNode {
  if (node.type !== Avatar)
    return node
  const own = node.props ?? {}
  const extra = Object.fromEntries(
    Object.entries(groupProps.value).filter(([key, value]) => value !== undefined && own[key] == null),
  )
  return Object.keys(extra).length ? cloneVNode(node, extra) : node
}

function Items() {
  const children = flatten(slots.default?.() ?? [])
  const visible = props.max == null ? children : children.slice(0, Math.max(0, props.max))
  const remaining = children.length - visible.length
  const nodes = visible.map(inherit)
  if (slots.count || remaining > 0) {
    nodes.push(h(Avatar, {
      ...groupProps.value,
      'data-slot': 'avatar-group-count',
      'class': ui.value.count({ class: props.ui?.count }),
    }, { fallback: slots.count ?? (() => `+${remaining}`) }))
  }
  return nodes
}
</script>

<template>
  <div data-slot="avatar-group" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <Items />
  </div>
</template>
